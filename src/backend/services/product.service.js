import { configureCloudinary } from "../config/cloudinary.js";

const cloudinary = configureCloudinary();
import mongoose from "mongoose";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

function serviceError(status, message, errors = []) {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;
  return error;
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function ensureCategory(categoryId) {
  if (!mongoose.isValidObjectId(categoryId)) throw serviceError(422, "categoryId không hợp lệ");
  const category = await Category.findById(categoryId).select("_id isActive");
  if (!category) throw serviceError(404, "Danh mục không tồn tại");
  return category;
}

export async function listProductsAdmin(query) {
  const page = Number.parseInt(query.page || "1", 10);
  const limit = Math.min(Number.parseInt(query.limit || "20", 10), 100);
  const filter = {};

  if (typeof query.search === "string" && query.search.trim()) {
    const search = query.search.trim().slice(0, 100);
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }
  if (typeof query.category === "string" && mongoose.isObjectIdOrHexString(query.category)) filter.categoryId = query.category;
  if (["ACTIVE", "PAUSED", "INACTIVE"].includes(query.status)) filter.status = query.status;

  const [items, total] = await Promise.all([
    Product.find(filter).populate("categoryId", "name slug isActive").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getProductAdmin(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID sản phẩm không hợp lệ");
  const product = await Product.findById(id).populate("categoryId", "name slug isActive");
  if (!product) throw serviceError(404, "Sản phẩm không tồn tại");
  return product;
}

export async function createProductAdmin(payload) {
  await ensureCategory(payload.categoryId);
  if (payload.salePrice != null && payload.salePrice >= payload.listPrice) {
    throw serviceError(422, "salePrice phải nhỏ hơn listPrice");
  }
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
  if (!slug) throw serviceError(422, "Slug không hợp lệ");

  const duplicateSlug = await Product.findOne({ $or: [{ name: payload.name }, { slug }] }).select("_id");
  if (duplicateSlug) throw serviceError(409, "Tên hoặc slug sản phẩm đã tồn tại");

  try {
    return await Product.create({ ...payload, slug });
  } catch (error) {
    if (error?.code === 11000) throw serviceError(409, "Tên hoặc slug sản phẩm đã tồn tại");
    throw error;
  }
}

export async function updateProductAdmin(id, payload) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID sản phẩm không hợp lệ");
  const product = await Product.findById(id);
  if (!product) throw serviceError(404, "Sản phẩm không tồn tại");

  if (payload.categoryId) await ensureCategory(payload.categoryId);
  const slug = payload.slug !== undefined ? slugify(payload.slug) : product.slug;
  const nextListPrice = payload.listPrice ?? product.listPrice;
  const nextSalePrice = payload.salePrice === undefined ? product.salePrice : payload.salePrice;
  if (nextSalePrice != null && nextSalePrice >= nextListPrice) {
    throw serviceError(422, "salePrice phải nhỏ hơn listPrice");
  }
  if (!slug) throw serviceError(422, "Slug không hợp lệ");

  const conflict = await Product.findOne({ _id: { $ne: product._id }, $or: [{ name: payload.name ?? product.name }, { slug }] }).select("_id");
  if (conflict) throw serviceError(409, "Tên hoặc slug sản phẩm đã tồn tại");

  const immutable = ["stock", "viewCount", "_id", "createdAt", "updatedAt"];
  for (const key of Object.keys(payload)) {
    if (!immutable.includes(key)) product[key] = payload[key];
  }
  product.slug = slug;

  try {
    await product.save();
    return product;
  } catch (error) {
    if (error?.code === 11000) throw serviceError(409, "Tên hoặc slug sản phẩm đã tồn tại");
    throw error;
  }
}

export async function updateProductStatusAdmin(id, status) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID sản phẩm không hợp lệ");
  const product = await Product.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true });
  if (!product) throw serviceError(404, "Sản phẩm không tồn tại");
  return product;
}

export async function deleteProductAdmin(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID sản phẩm không hợp lệ");
  const product = await Product.findById(id);
  if (!product) throw serviceError(404, "Sản phẩm không tồn tại");

  const usedInOrder = await Order.exists({ "items.productId": product._id });
  if (usedInOrder) {
    product.status = "INACTIVE";
    await product.save();
    return { action: "inactive", product };
  }

  await Product.deleteOne({ _id: product._id });

  if (cloudinary.config().cloud_name && product.images?.length) {
    await Promise.allSettled(product.images.map((image) => image.publicId ? cloudinary.uploader.destroy(image.publicId) : null));
  }

  return { action: "deleted", product };
}

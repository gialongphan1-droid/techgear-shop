import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

function serviceError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function listCategoriesAdmin(query = {}) {
  const page = Math.min(Math.max(Number.parseInt(query.page || "1", 10), 1), 100000);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || "20", 10), 1), 100);
  const filter = {};
  if (typeof query.search === "string" && query.search.trim()) {
    const search = query.search.trim().slice(0, 100);
    filter.$or = [{ name: { $regex: search, $options: "i" } }, { slug: { $regex: search, $options: "i" } }];
  }
  if (query.isActive === true || query.isActive === "true") filter.isActive = true;
  if (query.isActive === false || query.isActive === "false") filter.isActive = false;
  const [items, total] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Category.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getCategoryAdmin(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID danh mục không hợp lệ");
  const category = await Category.findById(id);
  if (!category) throw serviceError(404, "Danh mục không tồn tại");
  return category;
}

export async function createCategoryAdmin(payload) {
  const slug = slugify(payload.slug || payload.name);
  if (!slug) throw serviceError(422, "Slug không hợp lệ");
  if (await Category.findOne({ $or: [{ name: payload.name }, { slug }] }).select("_id")) {
    throw serviceError(409, "Tên hoặc slug danh mục đã tồn tại");
  }
  try {
    return await Category.create({ ...payload, slug });
  } catch (error) {
    if (error?.code === 11000) throw serviceError(409, "Tên hoặc slug danh mục đã tồn tại");
    throw error;
  }
}

export async function updateCategoryAdmin(id, payload) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID danh mục không hợp lệ");
  const category = await Category.findById(id);
  if (!category) throw serviceError(404, "Danh mục không tồn tại");
  const slug = payload.slug !== undefined ? slugify(payload.slug) : category.slug;
  if (!slug) throw serviceError(422, "Slug không hợp lệ");
  const conflict = await Category.findOne({ _id: { $ne: category._id }, $or: [{ name: payload.name ?? category.name }, { slug }] }).select("_id");
  if (conflict) throw serviceError(409, "Tên hoặc slug danh mục đã tồn tại");
  for (const key of ["name", "slug", "description", "iconUrl", "isActive"]) {
    if (payload[key] !== undefined) category[key] = key === "slug" ? slug : payload[key];
  }
  try { await category.save(); return category; } catch (error) { if (error?.code === 11000) throw serviceError(409, "Tên hoặc slug danh mục đã tồn tại"); throw error; }
}

export async function setCategoryActiveAdmin(id, isActive) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID danh mục không hợp lệ");
  const category = await Category.findByIdAndUpdate(id, { $set: { isActive } }, { new: true, runValidators: true });
  if (!category) throw serviceError(404, "Danh mục không tồn tại");
  return category;
}

export async function deleteCategoryAdmin(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID danh mục không hợp lệ");
  const category = await Category.findById(id);
  if (!category) throw serviceError(404, "Danh mục không tồn tại");
  const referencedProduct = await Product.exists({ categoryId: category._id });
  if (referencedProduct) throw serviceError(409, "Không thể xóa danh mục đang được sản phẩm sử dụng");
  await Category.deleteOne({ _id: category._id });
  return category;
}

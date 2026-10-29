import mongoose from "mongoose";
import Category from "../../models/Category.js";
import Product from "../../models/Product.js";

function serviceError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function publicProduct(product) {
  const item = typeof product.toObject === "function" ? product.toObject() : { ...product };
  delete item.stock;
  delete item.viewCount;
  delete item.updatedAt;
  if (item.categoryId && typeof item.categoryId === "object") {
    item.category = { _id: item.categoryId._id, name: item.categoryId.name, slug: item.categoryId.slug };
    delete item.categoryId;
  }
  if (Array.isArray(item.images)) {
    item.images = item.images.map(({ url, isPrimary }) => ({ url, isPrimary }));
  }
  return item;
}

export async function listPublicProducts(query = {}) {
  const page = Math.max(Number.parseInt(query.page || "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || "20", 10) || 20, 1), 100);
  const filter = { status: "ACTIVE" };

  const activeCategories = await Category.find({ isActive: true }).select("_id");
  filter.categoryId = { $in: activeCategories.map((category) => category._id) };

  if (typeof query.category === "string" && query.category.trim()) {
    const categoryQuery = query.category.trim().slice(0, 100);
    let category;
    if (mongoose.isObjectIdOrHexString(categoryQuery)) {
      category = activeCategories.find((item) => item._id.toString() === categoryQuery);
    } else {
      category = await Category.findOne({ slug: categoryQuery.toLowerCase(), isActive: true }).select("_id");
    }
    if (!category) return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    filter.categoryId = category._id;
  }

  if (typeof query.brand === "string" && query.brand.trim()) {
    filter.brand = { $regex: `^${escapeRegex(query.brand.trim().slice(0, 100))}$`, $options: "i" };
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.$and = [];
    if (query.minPrice !== undefined) {
      filter.$and.push({ $or: [{ salePrice: { $gte: Number(query.minPrice) } }, { salePrice: { $exists: false }, listPrice: { $gte: Number(query.minPrice) } }, { salePrice: null, listPrice: { $gte: Number(query.minPrice) } }] });
    }
    if (query.maxPrice !== undefined) {
      filter.$and.push({ $or: [{ salePrice: { $lte: Number(query.maxPrice) } }, { salePrice: { $exists: false }, listPrice: { $lte: Number(query.maxPrice) } }, { salePrice: null, listPrice: { $lte: Number(query.maxPrice) } }] });
    }
  }
  if (typeof query.search === "string" && query.search.trim()) {
    const search = escapeRegex(query.search.trim().slice(0, 100));
    filter.$or = [{ name: { $regex: search, $options: "i" } }, { slug: { $regex: search, $options: "i" } }, { brand: { $regex: search, $options: "i" } }];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    createdAt: { createdAt: -1 },
    oldest: { createdAt: 1 },
    priceAsc: { salePrice: 1, listPrice: 1 },
    price_asc: { salePrice: 1, listPrice: 1 },
    priceDesc: { salePrice: -1, listPrice: -1 },
    price_desc: { salePrice: -1, listPrice: -1 },
    popular: { viewCount: -1 },
  };
  const sort = sortMap[query.sort] || sortMap.newest;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .select("name slug categoryId brand listPrice salePrice status images specs warranty seo createdAt")
      .populate("categoryId", "name slug isActive")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { items: items.map(publicProduct), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getPublicProductBySlug(slug) {
  const safeSlug = typeof slug === "string" ? slug.trim().toLowerCase() : "";
  if (!safeSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(safeSlug) || safeSlug.length > 150) {
    throw serviceError(422, "Slug sản phẩm không hợp lệ");
  }
  const product = await Product.findOne({ slug: safeSlug, status: "ACTIVE" })
    .select("name slug categoryId brand listPrice salePrice status images specs warranty seo viewCount createdAt")
    .populate("categoryId", "name slug isActive")
    .lean();
  if (!product || !product.categoryId || !product.categoryId.isActive) {
    throw serviceError(404, "Sản phẩm không tồn tại hoặc không đang bán");
  }

  await Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } });
  return publicProduct(product);
}

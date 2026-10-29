import mongoose from "mongoose";
import Banner from "../models/Banner.js";
import { configureCloudinary } from "../config/cloudinary.js";

const cloudinary = configureCloudinary();
function serviceError(status, message) { const error = new Error(message); error.status = status; return error; }

export async function listBannersAdmin(query = {}) {
  const page = Math.min(Math.max(Number.parseInt(query.page || "1", 10), 1), 100000);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || "20", 10), 1), 100);
  const filter = {};
  if (typeof query.position === "string" && query.position.trim()) filter.position = query.position.trim().slice(0, 100);
  if (query.isActive === true || query.isActive === "true") filter.isActive = true;
  if (query.isActive === false || query.isActive === "false") filter.isActive = false;
  const [items, total] = await Promise.all([
    Banner.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Banner.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getBannerAdmin(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID banner không hợp lệ");
  const banner = await Banner.findById(id);
  if (!banner) throw serviceError(404, "Banner không tồn tại");
  return banner;
}

export async function createBannerAdmin(payload) {
  try { return await Banner.create(payload); } catch (error) { throw error; }
}

export async function updateBannerAdmin(id, payload) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID banner không hợp lệ");
  const banner = await Banner.findById(id);
  if (!banner) throw serviceError(404, "Banner không tồn tại");
  for (const key of ["title", "imageUrl", "publicId", "linkUrl", "position", "isActive"]) {
    if (payload[key] !== undefined) banner[key] = payload[key];
  }
  await banner.save(); return banner;
}

export async function setBannerActiveAdmin(id, isActive) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID banner không hợp lệ");
  const banner = await Banner.findByIdAndUpdate(id, { $set: { isActive } }, { new: true, runValidators: true });
  if (!banner) throw serviceError(404, "Banner không tồn tại");
  return banner;
}

export async function deleteBannerAdmin(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw serviceError(422, "ID banner không hợp lệ");
  const banner = await Banner.findById(id);
  if (!banner) throw serviceError(404, "Banner không tồn tại");
  await Banner.deleteOne({ _id: banner._id });
  if (cloudinary.config().cloud_name && banner.publicId) await cloudinary.uploader.destroy(banner.publicId);
  return banner;
}

import Banner from "../../models/Banner.js";
import Category from "../../models/Category.js";

export async function listPublicCategories() {
  const items = await Category.find({ isActive: true })
    .select("name slug description iconUrl isActive")
    .sort({ name: 1 })
    .lean();
  return { items };
}

export async function listPublicBanners() {
  const items = await Banner.find({ isActive: true })
    .select("title imageUrl linkUrl position isActive")
    .sort({ position: 1, createdAt: -1 })
    .lean();
  return { items };
}

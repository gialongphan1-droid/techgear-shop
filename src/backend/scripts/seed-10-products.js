import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const products = [
  { name: "MacBook Pro 14", brand: "Apple", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200", basePrice: 45000000, maxStock: 20 },
  { name: "iPhone 15 Pro", brand: "Apple", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200", basePrice: 28000000, maxStock: 30 },
  { name: "Samsung Galaxy S24", brand: "Samsung", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200", basePrice: 22000000, maxStock: 30 },
  { name: "Tai nghe Sony WH-1000XM5", brand: "Sony", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200", basePrice: 8500000, maxStock: 40 },
  { name: "Bàn phím cơ Logitech", brand: "Logitech", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200", basePrice: 2500000, maxStock: 50 },
  { name: "Chuột Logitech MX Master", brand: "Logitech", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200", basePrice: 2000000, maxStock: 50 },
  { name: "Màn hình Dell 27 inch", brand: "Dell", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200", basePrice: 7000000, maxStock: 25 },
  { name: "iPad Pro 11", brand: "Apple", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200", basePrice: 24000000, maxStock: 25 },
  { name: "Loa JBL Portable", brand: "JBL", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200", basePrice: 3000000, maxStock: 40 },
  { name: "Sạc dự phòng Anker", brand: "Anker", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200", basePrice: 1200000, maxStock: 60 },
];

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validateEnvironment() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI chưa được cấu hình trong src/backend/.env");
  }

  if (process.env.MONGODB_URI.includes("techgear_shop")) {
    const allowProduction = process.argv.includes("--allow-production");
    const confirmProduction = process.env.CONFIRM_PROD === "yes";
    if (!allowProduction || !confirmProduction) {
      throw new Error("Môi trường production bị chặn: cần --allow-production và CONFIRM_PROD=yes");
    }
  }

  const requiredCloudinaryVariables = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];
  const missingVariables = requiredCloudinaryVariables.filter((name) => !process.env[name]?.trim());
  if (missingVariables.length > 0) {
    throw new Error(`Thiếu biến môi trường Cloudinary: ${missingVariables.join(", ")}`);
  }
}

async function main() {
  validateEnvironment();

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    const category = await Category.findOneAndUpdate(
      { slug: "thiet-bi-cong-nghe" },
      {
        $set: {
          name: "Thiết bị công nghệ",
          slug: "thiet-bi-cong-nghe",
          description: "Các sản phẩm công nghệ được đề xuất cho cửa hàng",
          isActive: true,
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    for (const [index, item] of products.entries()) {
      const uploaded = await cloudinary.uploader.upload(item.image, {
        folder: "techgear_products",
        resource_type: "image",
      });

      const listPrice = Math.round((item.basePrice + randomInteger(-10, 10) * 100000) / 1000) * 1000;
      const salePrice = Math.round(listPrice * randomInteger(85, 95) / 100 / 1000) * 1000;
      const stock = randomInteger(0, item.maxStock);
      const slug = item.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      await Product.updateOne(
        { name: item.name },
        {
          $set: {
            name: item.name,
            slug,
            categoryId: category._id,
            brand: item.brand,
            listPrice,
            salePrice,
            stock,
            status: "ACTIVE",
            images: [{ url: uploaded.secure_url, isPrimary: true, publicId: uploaded.public_id }],
            specs: [],
            viewCount: 0,
          },
        },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );

      console.log(`[${index + 1}/${products.length}] Đã seed: ${item.name}`);
    }

    console.log(`Hoàn tất seed ${products.length} sản phẩm.`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Không thể seed sản phẩm:", error.message);
  process.exitCode = 1;
});

import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`🔗 Đã kết nối DB: ${mongoose.connection.name}`);

  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "techgear_products";

  // 1. Lấy danh sách public_id của ảnh đang dùng trong DB
  const products = await Product.find({}, "images");
  const dbPublicIds = new Set();
  
   products.forEach((p) => {
    (p.images || []).forEach((img) => {
      // Xử lý linh hoạt: Nếu img là string thì lấy luôn, nếu là object thì lấy thuộc tính .url
      const url = typeof img === "string" ? img : img?.url;
      
      if (url && typeof url === "string") {
        // Tách public_id từ URL
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
        if (match && match[1]) dbPublicIds.add(match[1]);
      }
    });
  });
  console.log(`📦 Tìm thấy ${dbPublicIds.size} ảnh đang được dùng trong DB.`);

  // 2. Lấy danh sách ảnh trên Cloudinary trong thư mục
  const cldImages = await cloudinary.api.resources({ type: "upload", prefix: folder, max_results: 500 });
  console.log(`☁️ Tìm thấy ${cldImages.resources.length} ảnh trên Cloudinary (folder: ${folder}).`);

  // 3. Lọc ra những ảnh có trên Cloudinary nhưng không có trong DB
  const orphans = cldImages.resources.filter((img) => !dbPublicIds.has(img.public_id));
  console.log(`\n🗑️ Tìm thấy ${orphans.length} ảnh mồ côi (không có trong DB).`);

  if (orphans.length === 0) {
    console.log("✨ Hệ thống sạch sẽ, không có ảnh rác nào!");
    return;
  }

  // 4. Xóa ảnh nếu có cờ --delete
  for (const img of orphans) {
    if (process.argv.includes("--delete")) {
      await cloudinary.uploader.destroy(img.public_id);
      console.log(`❌ Đã xóa vĩnh viễn: ${img.public_id}`);
    } else {
      console.log(`👀 [Chạy thử] Sẽ xóa: ${img.public_id}`);
    }
  }

  if (!process.argv.includes("--delete")) {
    console.log("\n⚠️ Đây là chế độ Xem thử (Dry-run). Chưa có ảnh nào bị xóa.");
    console.log("👉 Nếu chắc chắn muốn xóa, hãy chạy lại lệnh và thêm cờ: --delete");
  }
}

main()
  .catch(console.error)
  .finally(() => mongoose.disconnect());
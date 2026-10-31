import "dotenv/config";
import mongoose from "mongoose";
import { getSimilarProducts } from "../services/similarProducts.service.js";

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI chưa được cấu hình trong src/backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  try {
    const result = await getSimilarProducts("6ae5afe3b79b3afd6ff6ff17", 5);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Không thể kiểm tra sản phẩm tương tự:", error.message);
  process.exitCode = 1;
});

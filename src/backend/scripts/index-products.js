import "dotenv/config";
import mongoose from "mongoose";
import { client, collectionName, ensureCollection, objectIdToUuid } from "../config/qdrant.js";
import "../models/Category.js";
import Product from "../models/Product.js";
import { embedText } from "../services/embedding.service.js";

function buildProductText(product) {
  const description = typeof product.description === "string" ? product.description : "";
  const specs = Array.isArray(product.specs)
    ? product.specs
      .map((spec) => `${spec.name || spec.key || "Thông số"}: ${spec.value || ""} ${spec.unit || ""}`.trim())
      .join(", ")
    : "";

  return `${product.name}. Thương hiệu: ${product.brand}. ${description}. Danh mục: ${product.categoryId?.name || "N/A"}. Giá: ${product.listPrice} VNĐ. Thông số: ${specs}.`;
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI chưa được cấu hình trong src/backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const startedAt = Date.now();

  try {
    await ensureCollection();

    const products = await Product.find({ status: "ACTIVE" })
      .populate("categoryId", "name slug")
      .lean();

    if (products.length === 0) {
      console.warn("Không có sản phẩm ACTIVE để index.");
      return;
    }

    let indexed = 0;
    let failed = 0;

    for (const [index, product] of products.entries()) {
      const progress = `[${index + 1}/${products.length}]`;
      const productId = product._id.toString();

      try {
        const vector = await embedText(buildProductText(product));
        const image = product.images?.find((item) => item.isPrimary)?.url
          || product.images?.[0]?.url
          || null;

        await client.upsert(collectionName, {
          points: [{
            id: objectIdToUuid(productId),
            vector,
            payload: {
              productId,
              name: product.name,
              price: product.salePrice ?? product.listPrice,
              image,
              slug: product.slug,
            },
          }],
          wait: true,
        });

        indexed += 1;
        console.log(`${progress} Đã index: ${product.name}`);
      } catch (error) {
        failed += 1;
        console.error(`${progress} Index thất bại cho "${product.name}": ${error.message}`);
      }
    }

    console.log(`Hoàn tất: ${indexed}/${products.length} sản phẩm thành công; ${failed} thất bại.`);
    console.log(`Thời gian chạy: ${Date.now() - startedAt} ms.`);

    if (failed > 0) process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Không thể index sản phẩm:", error.message);
  process.exitCode = 1;
});

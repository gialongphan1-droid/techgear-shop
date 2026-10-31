import { client, collectionName, ensureCollection, objectIdToUuid } from "../config/qdrant.js";
import { embedText } from "./embedding.service.js";

function productToText(product, categoryName) {
  const specs = Array.isArray(product.specs)
    ? product.specs
      .map((spec) => `${spec.name || spec.key || "Thông số"}: ${spec.value || ""} ${spec.unit || ""}`.trim())
      .join(", ")
    : "";
  const description = typeof product.description === "string" ? product.description : "";

  return `${product.name}. Thương hiệu: ${product.brand}. ${description}. Danh mục: ${categoryName || "N/A"}. Giá: ${product.listPrice} VNĐ. Thông số: ${specs}.`;
}

export async function upsertProductVector(product, categoryName = null) {
  try {
    await ensureCollection();
    const text = productToText(product, categoryName);
    const productId = product._id.toString();
    const vector = await embedText(text);
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
    console.log(`[Qdrant Sync] Upserted: ${product.name}`);
    return true;
  } catch (error) {
    console.error("[Qdrant Sync] Upsert failed:", error.message);
    return false;
  }
}

export async function deleteProductVector(productId) {
  try {
    await ensureCollection();
    const pointId = objectIdToUuid(productId);
    await client.delete(collectionName, { points: [pointId], wait: true });
    console.log(`[Qdrant Sync] Deleted point: ${productId}`);
    return true;
  } catch (error) {
    console.error("[Qdrant Sync] Delete failed:", error.message);
    return false;
  }
}

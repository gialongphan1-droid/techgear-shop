import crypto from "node:crypto";
import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(backendDirectory, ".env") });

const DEFAULT_COLLECTION = "techgear_products";
const DEFAULT_DIMENSION = 768;

const dimension = Number(process.env.EMBEDDING_DIMENSION || DEFAULT_DIMENSION);
if (!Number.isSafeInteger(dimension) || dimension <= 0) {
  throw new Error("EMBEDDING_DIMENSION phải là số nguyên dương");
}

export const collectionName = process.env.QDRANT_COLLECTION?.trim() || DEFAULT_COLLECTION;
export const client = new QdrantClient({
  url: process.env.QDRANT_URL?.trim() || "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY?.trim() || undefined,
});

export function objectIdToUuid(objectId) {
  const bytes = crypto
    .createHash("sha256")
    .update(`techgear-product:${objectId}`)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function ensurePayloadIndex(fieldName, fieldSchema) {
  try {
    await client.createPayloadIndex(collectionName, {
      field_name: fieldName,
      field_schema: fieldSchema,
      wait: true,
    });
  } catch (error) {
    if (error.message?.toLowerCase().includes("already exists")) return;
    throw error;
  }
}

export async function ensureCollection() {
  const { collections } = await client.getCollections();
  if (!collections.some((collection) => collection.name === collectionName)) {
    try {
      await client.createCollection(collectionName, {
        vectors: {
          size: dimension,
          distance: "Cosine",
        },
      });
    } catch (error) {
      const { collections: latestCollections } = await client.getCollections();
      if (!latestCollections.some((collection) => collection.name === collectionName)) {
        throw error;
      }
    }
  }

  await ensurePayloadIndex("productId", "keyword");
  await ensurePayloadIndex("name", "text");
}

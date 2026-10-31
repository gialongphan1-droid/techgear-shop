import { client, collectionName, ensureCollection } from "../config/qdrant.js";

async function main() {
  if (!process.env.QDRANT_API_KEY?.trim()) {
    throw new Error("QDRANT_API_KEY chưa được cấu hình trong src/backend/.env");
  }

  await ensureCollection();
  const { collections } = await client.getCollections();
  const collectionExists = collections.some((collection) => collection.name === collectionName);
  if (!collectionExists) {
    throw new Error(`Collection "${collectionName}" chưa xuất hiện sau khi ensureCollection()`);
  }

  console.log("Kết nối Qdrant thành công.");
  console.log(`Số collection: ${collections.length}`);
  console.log(`Collection "${collectionName}" đã tồn tại.`);
}

main().catch((error) => {
  console.error("Không thể kết nối Qdrant:", error.message);
  process.exitCode = 1;
});

import "dotenv/config";
import crypto from "node:crypto";
import { client, collectionName, ensureCollection, objectIdToUuid } from "../config/qdrant.js";
import { deleteProductVector, upsertProductVector } from "../services/qdrantSync.service.js";

async function main() {
  const productId = crypto.randomBytes(12).toString("hex");
  const product = {
    _id: { toString: () => productId },
    name: "Qdrant Sync Test Product",
    brand: "TechGear Test",
    listPrice: 125000,
    salePrice: 100000,
    slug: `qdrant-sync-test-${productId}`,
    images: [{ url: "https://example.com/qdrant-sync-test.jpg", isPrimary: true }],
    specs: [{ name: "Test", value: "Vector sync", unit: "" }],
  };
  const pointId = objectIdToUuid(productId);
  let deletionVerified = false;

  try {
    await ensureCollection();
    const upsertPassed = await upsertProductVector(product, "Test");
    if (!upsertPassed) throw new Error("upsertProductVector returned false");

    const inserted = await client.retrieve(collectionName, {
      ids: [pointId],
      with_payload: true,
      with_vector: false,
    });
    if (inserted.length !== 1 || inserted[0].payload?.productId !== productId) {
      throw new Error("Upserted Qdrant point could not be verified");
    }
    console.log("PASS: product vector was upserted and verified");

    const deletePassed = await deleteProductVector(productId);
    if (!deletePassed) throw new Error("deleteProductVector returned false");

    const deleted = await client.retrieve(collectionName, {
      ids: [pointId],
      with_payload: false,
      with_vector: false,
    });
    if (deleted.length !== 0) throw new Error("Qdrant point still exists after deletion");
    deletionVerified = true;
    console.log("PASS: product vector was deleted and verified");
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (!deletionVerified) {
      const cleaned = await deleteProductVector(productId);
      if (!cleaned) {
        console.error("Cleanup failed: test point may remain in Qdrant.");
        process.exitCode = 1;
      }
    }
  }
}

main().catch((error) => {
  console.error("Qdrant sync test failed:", error.message);
  process.exitCode = 1;
});

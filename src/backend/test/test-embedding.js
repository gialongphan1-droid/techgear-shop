import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const backendDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(backendDirectory, ".env"), override: true });

const { embedText } = await import("../services/embedding.service.js");
const samples = [
  "Laptop chơi game có card đồ họa RTX và bộ nhớ RAM lớn.",
  "A gaming laptop with an RTX graphics card and plenty of memory.",
];

for (const sample of samples) {
  const vector = await embedText(sample);
  if (vector.length !== 768) {
    throw new Error(`Expected a 768-dimensional vector, received ${vector.length}`);
  }
  if (!vector.every(Number.isFinite)) {
    throw new Error("Embedding contains a non-finite value");
  }
}

console.log(`Embedding model smoke test passed (${samples.length} multilingual inputs, 768 dimensions).`);

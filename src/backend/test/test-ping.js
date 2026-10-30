import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (!cloudName || !apiKey || !apiSecret) {
  console.error("PING FAIL: Missing Cloudinary environment variables");
  process.exit(1);
}

console.log("[Cloudinary ping config]", {
  cloud_name: cloudName,
  cloud_name_length: cloudName.length,
  api_key_present: true,
  api_secret_present: true,
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

try {
  const result = await cloudinary.api.ping();
  console.log("PING OK:", result);
} catch (error) {
  console.error("PING FAIL:", {
    message: error.message,
    http_code: error.http_code,
    name: error.name,
    error: error.error,
  });
  process.exitCode = 1;
}

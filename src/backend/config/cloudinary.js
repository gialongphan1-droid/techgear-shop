import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
    debug: true,
  });

  const config = cloudinary.config();
  console.log("[Cloudinary config]", {
    cloud_name: config.cloud_name || null,
    api_key: config.api_key || null,
  });

  return cloudinary;
}

import { configureCloudinary } from "../config/cloudinary.js";

function serviceError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function sanitizeCloudinaryErrorMessage(message) {
  if (typeof message !== "string") {
    return undefined;
  }

  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  let sanitized = message;

  if (apiKey) {
    sanitized = sanitized.split(apiKey).join("[REDACTED_API_KEY]");
  }
  if (apiSecret) {
    sanitized = sanitized.split(apiSecret).join("[REDACTED_API_SECRET]");
  }

  return sanitized.replace(/Unknown API key\s+\d+/i, "Unknown API key [REDACTED_API_KEY]");
}

export async function uploadAdminImage(file) {
  if (!file?.buffer || file.buffer.length === 0) {
    throw serviceError(422, "Vui lòng chọn một file ảnh");
  }

  try {
    const cloudinary = configureCloudinary();
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      throw serviceError(
        503,
        "Cloudinary chưa được cấu hình. Vui lòng thiết lập biến môi trường CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET",
      );
    }

    const folder =
      process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "techgear/uploads";

    return await new Promise((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            timeout: 60000,
            transformation: [
              {
                width: 1600,
                height: 1600,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) {
              console.error("Lỗi Cloudinary:", error);
              console.error("[Cloudinary upload error]", {
                name: error.name,
                message: sanitizeCloudinaryErrorMessage(error.message),
                code: error.code,
                http_code: error.http_code,
                error: error.error,
              });

              const uploadError = serviceError(
                502,
                "Không thể upload ảnh lên Cloudinary",
              );
              uploadError.cause = error;
              reject(uploadError);
              return;
            }

            if (!result?.secure_url || !result?.public_id) {
              reject(serviceError(502, "Cloudinary không trả về thông tin ảnh hợp lệ"));
              return;
            }

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          },
        );

        uploadStream.end(file.buffer);
      } catch (error) {
        console.error("Lỗi Cloudinary:", error);
        console.error("[Cloudinary upload stream error]", error);
        reject(error);
      }
    });
  } catch (error) {
    console.error("Lỗi Cloudinary:", error);
    console.error("[Cloudinary upload service error]", {
      name: error.name,
      message: error.message,
      code: error.code,
      http_code: error.http_code,
      status: error.status,
    });

    if (error.status) {
      throw error;
    }

    throw serviceError(502, "Không thể upload ảnh lên Cloudinary");
  }
}
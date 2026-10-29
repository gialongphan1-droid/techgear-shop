import { configureCloudinary } from "../config/cloudinary.js";

function serviceError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function uploadAdminImage(file) {
  if (!file?.buffer || file.buffer.length === 0) {
    throw serviceError(422, "Vui lòng chọn một file ảnh");
  }

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

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
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
  });
}
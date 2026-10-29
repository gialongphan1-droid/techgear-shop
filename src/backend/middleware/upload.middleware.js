import path from "node:path";
import multer from "multer";

const storage = multer.memoryStorage();
const allowedMimeTypes = new Set([
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function detectImageSignature(buffer) {
  if (!buffer || buffer.length < 12) {
    return null;
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpeg";
  }

  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10,
    parts: 12,
  },
  fileFilter(_req, file, callback) {
    const mimeType = String(file.mimetype || "").toLowerCase();
    const extension = path.extname(String(file.originalname || "")).toLowerCase();

    if (
      !allowedMimeTypes.has(mimeType) ||
      !allowedExtensions.has(extension)
    ) {
      const error = new Error(
        "File không hợp lệ. Chỉ hỗ trợ JPG, JPEG, PNG hoặc WEBP",
      );
      error.status = 422;
      callback(error);
      return;
    }

    callback(null, true);
  },
}).single("image");

export function uploadImage(req, res, next) {
  imageUpload(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          error.status = 413;
          error.message = "Dung lượng ảnh không được vượt quá 5MB";
        } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
          error.status = 422;
          error.message = "Trường upload phải là 'image'";
        } else {
          error.status = 422;
        }
      } else if (!error.status) {
        error.status = 422;
      }
      next(error);
      return;
    }

    if (!req.file?.buffer || req.file.buffer.length === 0) {
      return res.status(422).json({
        success: false,
        message: "Vui lòng chọn một file ảnh",
        data: {},
        errors: [{ field: "image", message: "File ảnh không được để trống" }],
      });
    }

    const extension = path
      .extname(String(req.file.originalname || ""))
      .toLowerCase();
    const signature = detectImageSignature(req.file.buffer);
    const signatureExtension =
      extension === ".jpg" || extension === ".jpeg" ? "jpeg"
        : extension.slice(1) || null;

    if (!signature || signature !== signatureExtension) {
      const invalidImage = new Error(
        "Nội dung file không khớp định dạng JPG, JPEG, PNG hoặc WEBP",
      );
      invalidImage.status = 422;
      return next(invalidImage);
    }

    const mimeType = String(req.file.mimetype || "").toLowerCase();
    const validMimeForSignature =
      (signature === "jpeg" && (mimeType === "image/jpeg" || mimeType === "image/jpg")) ||
      (signature === "png" && mimeType === "image/png") ||
      (signature === "webp" && mimeType === "image/webp");

    if (!validMimeForSignature) {
      const invalidImage = new Error(
        "File không hợp lệ. MIME type không khớp với nội dung ảnh",
      );
      invalidImage.status = 422;
      return next(invalidImage);
    }

    return next();
  });
}

export const uploadImageMiddleware = uploadImage;
export default uploadImage;
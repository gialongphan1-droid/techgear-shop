import multer from "multer";

const storage = multer.memoryStorage();
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const fieldsUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10,
    parts: 12,
  },
  fileFilter(_req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error(
        "File không hợp lệ. Chỉ hỗ trợ JPEG, PNG, WEBP hoặc GIF",
      );
      error.status = 422;
      callback(error);
      return;
    }
    callback(null, true);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

export function uploadImage(req, res, next) {
  fieldsUpload(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        error.status = error.code === "LIMIT_FILE_SIZE" ? 413 : 422;
        if (error.code === "LIMIT_FILE_SIZE") {
          error.message = "Dung lượng ảnh không được vượt quá 5MB";
        }
      } else if (!error.status) {
        error.status = 422;
      }
      next(error);
      return;
    }

    const file =
      req.files?.image?.[0] ||
      req.files?.file?.[0];

    if (file) {
      req.file = file;
    }

    if (!req.file?.buffer || req.file.buffer.length === 0) {
      return res.status(422).json({
        success: false,
        message: "Vui lòng chọn một file ảnh",
        data: {},
        errors: [{ field: "image", message: "File ảnh không được để trống" }],
      });
    }

    return next();
  });
}

export const uploadImageMiddleware = uploadImage;
export default uploadImage;
import { uploadAdminImage } from "../services/adminUpload.service.js";

export async function uploadImage(req, res, next) {
  try {
    if (!req.file?.buffer || req.file.buffer.length === 0) {
      return res.status(422).json({
        success: false,
        message: "Vui lòng chọn một file ảnh",
        data: {},
        errors: [{ field: "image", message: "File ảnh không được để trống" }],
      });
    }

    const data = await uploadAdminImage(req.file);
    return res.status(200).json({
      success: true,
      message: "Upload ảnh thành công",
      data,
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
}
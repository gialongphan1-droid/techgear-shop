import { body } from "express-validator";

export const validateLogin = [
  (req, res, next) => {
    const allowedFields = new Set(["email", "password"]);
    const extraFields = Object.keys(req.body || {}).filter((field) => !allowedFields.has(field));
    if (extraFields.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Trường dữ liệu không hợp lệ",
        data: {},
        errors: extraFields.map((field) => ({ field, message: "Trường không được phép" })),
      });
    }
    return next();
  },
  body("email")
    .exists().withMessage("Email là bắt buộc")
    .bail()
    .isString().withMessage("Email phải là chuỗi")
    .bail()
    .trim()
    .isLength({ min: 3, max: 254 }).withMessage("Email không hợp lệ")
    .bail()
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .exists().withMessage("Mật khẩu là bắt buộc")
    .bail()
    .isString().withMessage("Mật khẩu phải là chuỗi")
    .bail()
    .isLength({ min: 8, max: 128 }).withMessage("Mật khẩu tối thiểu 8 ký tự")
    .matches(/[A-Za-z]/).withMessage("Mật khẩu phải chứa chữ")
    .matches(/\d/).withMessage("Mật khẩu phải chứa số"),
];

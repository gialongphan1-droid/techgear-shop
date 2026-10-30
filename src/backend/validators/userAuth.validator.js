import { body, query } from "express-validator";

function validateObjectBody(allowedFields) {
  return (req, res, next) => {
    const bodyValue = req.body;
    if (!bodyValue || typeof bodyValue !== "object" || Array.isArray(bodyValue)) {
      return res.status(422).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        data: {},
        errors: [{ field: "body", message: "Body phải là object" }],
      });
    }

    const unexpectedFields = Object.keys(bodyValue).filter((field) => !allowedFields.includes(field));
    if (unexpectedFields.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        data: {},
        errors: unexpectedFields.map((field) => ({ field, message: "Trường không được phép" })),
      });
    }
    return next();
  };
}

const emailValidator = body("email")
  .exists().withMessage("Email là bắt buộc")
  .bail()
  .isString().withMessage("Email phải là chuỗi")
  .bail()
  .trim()
  .isLength({ min: 3, max: 254 }).withMessage("Email không hợp lệ")
  .bail()
  .isEmail().withMessage("Email không hợp lệ")
  .normalizeEmail();

const passwordValidator = body("password")
  .exists().withMessage("Mật khẩu là bắt buộc")
  .bail()
  .isString().withMessage("Mật khẩu phải là chuỗi")
  .bail()
  .isLength({ min: 8, max: 128 }).withMessage("Mật khẩu phải từ 8 đến 128 ký tự")
  .matches(/[A-Za-z]/).withMessage("Mật khẩu phải chứa chữ")
  .matches(/\d/).withMessage("Mật khẩu phải chứa số");

export const validateUserRegistration = [
  validateObjectBody(["fullName", "email", "password"]),
  body("fullName")
    .exists().withMessage("Họ tên là bắt buộc")
    .bail()
    .isString().withMessage("Họ tên phải là chuỗi")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Họ tên phải từ 2 đến 100 ký tự")
    .matches(/^[^<>]*$/).withMessage("Họ tên không hợp lệ"),
  emailValidator,
  passwordValidator,
];

export const validateUserLogin = [
  validateObjectBody(["email", "password"]),
  emailValidator,
  passwordValidator,
];

export const validateEmailVerification = [
  query("token")
    .exists().withMessage("Token xác thực là bắt buộc")
    .bail()
    .isString().withMessage("Token không hợp lệ")
    .bail()
    .matches(/^[a-f0-9]{64}$/i).withMessage("Token không hợp lệ"),
];

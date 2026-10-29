import rateLimit from "express-rate-limit";

export const cartRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || "unknown",
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu giỏ hàng, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || "unknown",
  message: {
    success: false,
    message: "Bạn đã thử đăng nhập quá nhiều lần, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

export const orderRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || "unknown",
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu tạo đơn, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

export const trackOrderIpRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || "unknown",
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu tra cứu, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

export const trackOrderCodeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const orderCode = req.body?.orderCode;
    if (typeof orderCode === "string" && /^TG-\d{8}-[A-F0-9]{10}$/i.test(orderCode.trim())) {
      return orderCode.trim().toUpperCase();
    }
    return `invalid:${req.ip || "unknown"}`;
  },
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu tra cứu, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

export const inventoryAdjustRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.admin?.id ? `admin:${req.admin.id}` : (req.ip || "unknown"),
  message: {
    success: false,
    message: "Bạn đã điều chỉnh tồn kho quá nhiều lần, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

export const adminOrderStatusRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.admin?.id ? `admin:${req.admin.id}` : (req.ip || "unknown"),
  message: {
    success: false,
    message: "Bạn đã cập nhật trạng thái đơn quá nhiều lần, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

export const adminUploadRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) =>
    req.admin?.id ? `admin:${req.admin.id}` : (req.ip || "unknown"),
  message: {
    success: false,
    message: "Bạn đã upload ảnh quá nhiều lần, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

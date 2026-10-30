import rateLimit from "express-rate-limit";

const isRateLimitDisabled = () =>
  process.env.RATE_LIMIT_ENABLED?.trim().toLowerCase() === "false";

export const globalApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: () => {
    const configuredLimit = Number(process.env.RATE_LIMIT_MAX);
    return Number.isInteger(configuredLimit) && configuredLimit > 0
      ? configuredLimit
      : 300;
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: isRateLimitDisabled,
  keyGenerator: (req) => req.ip || "unknown",
  handler: (_req, res) => {
    return res.status(429).json({
      success: false,
      message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau.",
      data: {},
      errors: [],
    });
  },
});

export const cartRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: isRateLimitDisabled,
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
  skip: isRateLimitDisabled,
  keyGenerator: (req) => req.ip || "unknown",
  handler: (_req, res) => {
    return res.status(429).json({
      success: false,
      message: "Bạn đã thử đăng nhập quá nhiều lần, vui lòng thử lại sau.",
      data: {},
      errors: [],
    });
  },
});

export const orderRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: isRateLimitDisabled,
  keyGenerator: (req) => req.ip || "unknown",
  handler: (_req, res) => {
    return res.status(429).json({
      success: false,
      message: "Bạn đã gửi quá nhiều yêu cầu tạo đơn, vui lòng thử lại sau.",
      data: {},
      errors: [],
    });
  },
});

export const trackOrderIpRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: isRateLimitDisabled,
  keyGenerator: (req) => req.ip || "unknown",
  handler: (_req, res) => {
    return res.status(429).json({
      success: false,
      message: "Bạn đã gửi quá nhiều yêu cầu tra cứu, vui lòng thử lại sau.",
      data: {},
      errors: [],
    });
  },
});

export const trackOrderCodeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: isRateLimitDisabled,
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
  skip: isRateLimitDisabled,
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
  skip: isRateLimitDisabled,
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
  skip: isRateLimitDisabled,
  keyGenerator: (req) =>
    req.admin?.id ? `admin:${req.admin.id}` : (req.ip || "unknown"),
  message: {
    success: false,
    message: "Bạn đã upload ảnh quá nhiều lần, vui lòng thử lại sau.",
    data: {},
    errors: [],
  },
});

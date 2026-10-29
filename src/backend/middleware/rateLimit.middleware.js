import rateLimit from "express-rate-limit";

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

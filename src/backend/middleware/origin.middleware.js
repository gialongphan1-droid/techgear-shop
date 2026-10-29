export function checkOrigin(req, res, next) {
  const allowedOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origin = req.get("origin");
  const referer = req.get("referer");
  let refererOrigin;

  if (referer) {
    try {
      refererOrigin = new URL(referer).origin;
    } catch {
      return res.status(403).json({ success: false, message: "Origin không hợp lệ", data: {}, errors: [] });
    }
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: "Origin không hợp lệ", data: {}, errors: [] });
  }
  if (!origin && refererOrigin && !allowedOrigins.includes(refererOrigin)) {
    return res.status(403).json({ success: false, message: "Origin không hợp lệ", data: {}, errors: [] });
  }
  if (!origin && !refererOrigin) {
    return res.status(403).json({ success: false, message: "Origin không hợp lệ", data: {}, errors: [] });
  }

  return next();
}

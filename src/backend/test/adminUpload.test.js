import assert from "node:assert/strict";

const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

async function readJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text };
  }
}

const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: origin,
  },
  body: JSON.stringify({
    email: "admin@techgear.com",
    password: "Admin@123456",
  }),
});

const loginBody = await readJson(loginResponse);
assert.equal(loginResponse.ok, true, `Đăng nhập thất bại: ${JSON.stringify(loginBody)}`);

const cookies = loginResponse.headers
  .getSetCookie?.()
  .map((cookie) => cookie.split(";")[0])
  .join("; ");
assert.ok(cookies, "Server không trả về cookie đăng nhập");

const csrfToken = loginBody.data?.csrfToken;
assert.ok(csrfToken, "Server không trả về CSRF token");

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);
const formData = new FormData();
formData.append("image", new Blob([png], { type: "image/png" }), "test-upload.png");

const uploadResponse = await fetch(`${baseUrl}/api/admin/upload`, {
  method: "POST",
  headers: {
    Cookie: cookies,
    "x-csrf-token": csrfToken,
    Origin: origin,
  },
  body: formData,
});

const uploadBody = await readJson(uploadResponse);
console.log(JSON.stringify({
  status: uploadResponse.status,
  success: uploadBody.success,
  message: uploadBody.message,
  url: uploadBody.data?.url,
  publicId: uploadBody.data?.publicId,
}, null, 2));

assert.equal(uploadResponse.status, 200, JSON.stringify(uploadBody));
assert.equal(uploadBody.success, true);
assert.ok(uploadBody.data?.url, "Cloudinary không trả về URL ảnh");

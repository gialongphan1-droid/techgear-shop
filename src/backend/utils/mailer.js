import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, token) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.EMAIL_HOST;
  if (!host && (!user || !pass)) {
    throw new Error("EMAIL_USER và EMAIL_PASS phải được cấu hình để gửi email xác thực");
  }

  const transporter = host
    ? nodemailer.createTransport({
        host,
        port: Number(process.env.EMAIL_PORT) || 25,
        secure: String(process.env.EMAIL_SECURE).toLowerCase() === "true",
        ...(String(process.env.EMAIL_SMTP_AUTH).toLowerCase() === "true" && user && pass
          ? { auth: { user, pass } }
          : {}),
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
  const verificationUrl = `http://localhost:5173/verify-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || user || "TechGear Shop <no-reply@localhost>",
    to: email,
    subject: "Xác thực tài khoản TechGear Shop",
    text: `Vui lòng xác thực tài khoản bằng liên kết sau: ${verificationUrl}\nLiên kết có hiệu lực trong 24 giờ.`,
    html: `<p>Vui lòng xác thực tài khoản TechGear Shop:</p><p><a href="${verificationUrl}">Xác thực email</a></p><p>Liên kết có hiệu lực trong 24 giờ.</p>`,
  });
}

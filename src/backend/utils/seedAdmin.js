import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ADMIN_EMAIL = "admin@techgear.com";
const ADMIN_PASSWORD = "Admin@123456";
const ADMIN_NAME = "TechGear Administrator";

async function seedAdmin() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI chưa được cấu hình trong file .env");
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,128}$/.test(ADMIN_PASSWORD)) {
    throw new Error("Mật khẩu Admin không đáp ứng quy tắc bảo mật");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const email = ADMIN_EMAIL.toLowerCase().trim();
  let admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    admin = new Admin({
      name: ADMIN_NAME,
      email,
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      tokenVersion: 0,
    });
    await admin.save();
    console.log(`Đã tạo tài khoản Admin: ${email}`);
  } else {
    admin.name = ADMIN_NAME;
    admin.password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await admin.save();
    console.log(`Đã cập nhật tài khoản Admin: ${email}`);
  }
}

seedAdmin()
  .catch((error) => {
    console.error("Không thể seed tài khoản Admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

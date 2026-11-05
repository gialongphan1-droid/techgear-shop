import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const REPLACEMENTS = [
  ["Dung l??ng", "Dung lượng"],
  ["dung l??ng", "dung lượng"],
  ["B? x? l?", "Bộ xử lý"],
  ["b? x? l?", "bộ xử lý"],
  ["Giao ti?p", "Giao tiếp"],
  ["giao ti?p", "giao tiếp"],
  ["th? nghi?m", "thử nghiệm"],
  ["s?n ph?m", "sản phẩm"],
  ["C?ng ngh?", "Công nghệ"],
  ["c?ng ngh?", "công nghệ"],
  ["Thi?t b?", "Thiết bị"],
  ["thi?t b?", "thiết bị"],
  ["Màn hình", "Màn hình"],
  ["th?ng", "tháng"],
  ["l??ng", "lượng"],
  ["B?n ph?m", "Bàn phím"],
  ["b?n ph?m", "bàn phím"],
  ["Chu?t", "Chuột"],
  ["chu?t", "chuột"],
  ["Tai nghe", "Tai nghe"],
  ["b? nh?", "bộ nhớ"],
  ["l?u tr?", "lưu trữ"],
  ["k?t n?i", "kết nối"],
  ["h? tr?", "hỗ trợ"],
  ["ch?t l??ng", "chất lượng"],
  ["kh?ng gian", "không gian"],
  ["màu s?c", "màu sắc"],
  ["Nh?n", "Nhân"],
  ["nh?n", "nhân"],
  ["Pin", "Pin"],
  ["C?ng", "Cổng"],
  ["c?ng", "cổng"],
  ["RAM", "RAM"],
];

export function fixEncoding(value) {
  if (typeof value !== "string") return value;

  let fixed = value;
  for (const [broken, correct] of REPLACEMENTS) {
    fixed = fixed.split(broken).join(correct);
  }
  return fixed;
}

export function validateEnvironment(argv = process.argv) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI chưa được cấu hình trong src/backend/.env");
  }

  if (process.env.MONGODB_URI.includes("techgear_shop")) {
    const allowProduction = argv.includes("--allow-production");
    const confirmProduction = process.env.CONFIRM_PROD === "yes";
    if (!allowProduction || !confirmProduction) {
      throw new Error("Môi trường production bị chặn: cần --allow-production và CONFIRM_PROD=yes");
    }
  }
}

function containsQuestionMark(value) {
  if (typeof value === "string") return value.includes("?");
  if (Array.isArray(value)) return value.some((item) => containsQuestionMark(item));
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => containsQuestionMark(item));
  }
  return false;
}

export function buildProductFix(product) {
  const updates = {};

  for (const field of ["name", "description", "warranty"]) {
    if (typeof product[field] === "string" && product[field].includes("?")) {
      const fixed = fixEncoding(product[field]);
      if (fixed !== product[field]) updates[field] = fixed;
    }
  }

  if (Array.isArray(product.specs)) {
    let specsChanged = false;
    const fixedSpecs = product.specs.map((spec) => {
      if (!spec || typeof spec !== "object") return spec;

      const fixedSpec = { ...spec };
      for (const field of ["name", "unit"]) {
        if (typeof fixedSpec[field] === "string" && fixedSpec[field].includes("?")) {
          const fixed = fixEncoding(fixedSpec[field]);
          if (fixed !== fixedSpec[field]) {
            fixedSpec[field] = fixed;
            specsChanged = true;
          }
        }
      }
      return fixedSpec;
    });

    if (specsChanged) updates.specs = fixedSpecs;
  }

  return updates;
}

export async function main(argv = process.argv) {
  validateEnvironment(argv);

  const apply = argv.includes("--apply");
  await mongoose.connect(process.env.MONGODB_URI);

  try {
    const products = mongoose.connection.collection("products");
    const cursor = products.find({
      $or: [
        { name: /\?/ },
        { description: /\?/ },
        { "specs.name": /\?/ },
        { "specs.unit": /\?/ },
        { warranty: /\?/ },
      ],
    });

    let scanned = 0;
    let candidates = 0;
    let updated = 0;

    for await (const product of cursor) {
      scanned += 1;
      if (!containsQuestionMark({
        name: product.name,
        description: product.description,
        specs: product.specs,
        warranty: product.warranty,
      })) continue;

      const updates = buildProductFix(product);
      if (Object.keys(updates).length === 0) continue;

      candidates += 1;
      if (apply) {
        await products.updateOne(
          { _id: product._id },
          { $set: updates },
        );
        updated += 1;
      }
    }

    console.log(
      apply
        ? `Hoàn tất: quét ${scanned} sản phẩm, ${candidates} sản phẩm có thể sửa, đã cập nhật ${updated}.`
        : `Chế độ dry-run: quét ${scanned} sản phẩm, tìm thấy ${candidates} sản phẩm cần sửa. Thêm --apply để ghi dữ liệu.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error("Không thể sửa mã hóa sản phẩm:", error.message);
    process.exitCode = 1;
  });
}

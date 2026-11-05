import test from "node:test";
import assert from "node:assert/strict";
import {
  buildProductFix,
  fixEncoding,
  validateEnvironment,
} from "../scripts/fix-encoding-v2.js";

test("fixEncoding replaces known Vietnamese mojibake phrases", () => {
  assert.equal(
    fixEncoding("Dung l??ng; B? x? l?; th?ng; s?n ph?m; th? nghi?m; Giao ti?p"),
    "Dung lượng; Bộ xử lý; tháng; sản phẩm; thử nghiệm; Giao tiếp",
  );
});

test("buildProductFix updates supported product fields and nested specs", () => {
  const updates = buildProductFix({
    name: "s?n ph?m c?ng ngh?",
    description: "Dung l??ng th?ng",
    specs: [
      { name: "B? x? l?", unit: "nh?n" },
    ],
    warranty: "12 th?ng",
  });

  assert.equal(updates.name, "sản phẩm công nghệ");
  assert.equal(updates.description, "Dung lượng tháng");
  assert.equal(updates.specs[0].name, "Bộ xử lý");
  assert.equal(updates.specs[0].unit, "nhân");
  assert.equal(updates.warranty, "12 tháng");
});

test("validateEnvironment blocks production URI without confirmation", () => {
  const originalUri = process.env.MONGODB_URI;
  const originalConfirm = process.env.CONFIRM_PROD;

  try {
    process.env.MONGODB_URI = "mongodb://localhost/techgear_shop";
    delete process.env.CONFIRM_PROD;

    assert.throws(
      () => validateEnvironment(["node", "fix-encoding-v2.js"]),
      /production bị chặn/,
    );

    process.env.CONFIRM_PROD = "yes";
    assert.throws(
      () => validateEnvironment(["node", "fix-encoding-v2.js"]),
      /production bị chặn/,
    );

    validateEnvironment(["node", "fix-encoding-v2.js", "--allow-production"]);
  } finally {
    if (originalUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalUri;

    if (originalConfirm === undefined) delete process.env.CONFIRM_PROD;
    else process.env.CONFIRM_PROD = originalConfirm;
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { validateCartStockQuantity } from "../services/cart/cart.service.js";

test("cart stock validation allows quantities within stock", () => {
  assert.doesNotThrow(() => validateCartStockQuantity(3, 5));
  assert.doesNotThrow(() => validateCartStockQuantity(5, 5));
});

test("cart stock validation rejects combined quantity over stock with 400", () => {
  assert.throws(
    () => validateCartStockQuantity(6, 5),
    (error) => error.status === 400
      && error.message === "Số lượng vượt quá tồn kho hiện tại",
  );
});

import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
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

test("cart items accept a quantity of 50 but reject quantities above 50", () => {
  const cart = new Cart({
    tokenHash: "test-token",
    expireAt: new Date(),
    items: [{ productId: new mongoose.Types.ObjectId(), quantity: 50 }],
  });
  assert.equal(cart.validateSync(), undefined);

  cart.items[0].quantity = 51;
  assert.equal(cart.validateSync().errors["items.0.quantity"].kind, "max");
});

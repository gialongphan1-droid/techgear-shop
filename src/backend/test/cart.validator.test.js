import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import {
  validateAddCartItem,
  validateUpdateCartItem,
} from "../validators/cart/cart.validator.js";

async function validate(rules, req) {
  await Promise.all(rules.map((rule) => rule.run(req)));
  return validationResult(req).array();
}

test("cart validators accept quantities up to 50 and reject 51", async () => {
  const productId = new mongoose.Types.ObjectId().toString();
  const scenarios = [
    {
      rules: validateAddCartItem,
      makeRequest: (quantity) => ({
        body: { productId, quantity },
        params: {},
      }),
    },
    {
      rules: validateUpdateCartItem,
      makeRequest: (quantity) => ({
        body: { quantity },
        params: { productId },
      }),
    },
  ];

  for (const scenario of scenarios) {
    assert.deepEqual(
      await validate(scenario.rules, scenario.makeRequest(50)),
      [],
    );
    assert.ok(
      (await validate(scenario.rules, scenario.makeRequest(51))).length > 0,
    );
  }
});

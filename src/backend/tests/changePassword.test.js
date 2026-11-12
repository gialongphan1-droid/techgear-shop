import assert from "node:assert/strict";
import test from "node:test";
import { isPasswordStrong } from "../services/userAuth.service.js";

test("password strength requires at least 8 characters", () => {
  assert.equal(isPasswordStrong("Abc1234"), false);
  assert.equal(isPasswordStrong("Abc12345"), true);
  assert.equal(isPasswordStrong(`A1${"a".repeat(126)}`), true);
  assert.equal(isPasswordStrong(`A1${"a".repeat(127)}`), false);
});

test("password strength requires at least one letter and one digit", () => {
  assert.equal(isPasswordStrong("abcdefgh"), false);
  assert.equal(isPasswordStrong("12345678"), false);
  assert.equal(isPasswordStrong("abc12345"), true);
});

test("password strength rejects non-string values", () => {
  assert.equal(isPasswordStrong(null), false);
  assert.equal(isPasswordStrong(12345678), false);
});

import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, registerSchema } from "../src/controllers/authController.js";

test("auth validation accepts valid registration data", () => {
  const result = registerSchema.safeParse({
    name: "Awa Diallo",
    email: "AWA@example.com",
    password: "password123",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.email, "AWA@example.com");
});

test("auth validation rejects weak passwords and malformed emails", () => {
  const result = loginSchema.safeParse({
    email: "not-an-email",
    password: "",
  });

  assert.equal(result.success, false);
});

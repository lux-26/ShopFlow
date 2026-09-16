import test from "node:test";
import assert from "node:assert/strict";
import { requireRole } from "../src/middleware/auth.js";
import { fileFilter } from "../src/config/uploads.js";

function responseMock() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("permissions reject non-admin users", () => {
  const response = responseMock();
  let nextCalled = false;

  requireRole("ADMIN")(
    { user: { role: "CUSTOMER" } },
    response,
    () => {
      nextCalled = true;
    },
  );

  assert.equal(response.statusCode, 403);
  assert.equal(nextCalled, false);
});

test("permissions allow administrators", () => {
  const response = responseMock();
  let nextCalled = false;

  requireRole("ADMIN")(
    { user: { role: "ADMIN" } },
    response,
    () => {
      nextCalled = true;
    },
  );

  assert.equal(nextCalled, true);
});

test("uploads reject unsupported MIME types", () => {
  let callbackError;
  fileFilter({}, { mimetype: "application/pdf" }, (error) => {
    callbackError = error;
  });

  assert.match(callbackError.message, /Format d'image non supporté/);
});

test("uploads accept supported image MIME types", () => {
  let callbackResult;
  fileFilter({}, { mimetype: "image/webp" }, (error, accepted) => {
    callbackResult = { error, accepted };
  });

  assert.deepEqual(callbackResult, { error: null, accepted: true });
});

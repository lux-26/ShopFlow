import test from "node:test";
import assert from "node:assert/strict";
import {
  createOrderSchema,
  updateStatusSchema,
} from "../src/controllers/orderController.js";

const validOrder = {
  items: [{ productId: "507f1f77bcf86cd799439011", quantity: 2 }],
  shippingAddress: {
    firstName: "Awa",
    lastName: "Diallo",
    address: "12 rue du marché",
    city: "Dakar",
    phone: "771234567",
  },
  shippingMode: "standard",
  paymentMethod: "card",
};

test("order validation covers supported payment methods", () => {
  for (const paymentMethod of ["card", "orange", "wave", "cash"]) {
    const result = createOrderSchema.safeParse({ ...validOrder, paymentMethod });
    assert.equal(result.success, true, paymentMethod);
  }
});

test("order validation rejects invalid quantities and statuses", () => {
  const invalidQuantity = createOrderSchema.safeParse({
    ...validOrder,
    items: [{ ...validOrder.items[0], quantity: 0 }],
  });
  const invalidStatus = updateStatusSchema.safeParse({ status: "Refunded" });

  assert.equal(invalidQuantity.success, false);
  assert.equal(invalidStatus.success, false);
});

import { randomUUID } from "node:crypto";
import { z } from "zod";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";
import PromoCode from "../models/PromoCode.js";

const LOYALTY_DISCOUNT = 5000;
const personName = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[\p{L}][\p{L}' -]+$/u, "Utilisez uniquement des lettres.")
  .refine(
    (value) => (value.match(/[aeiouyàâäéèêëîïôöùûüÿ]/gi) || []).length >= 2,
    "Nom invalide.",
  );
const cityName = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[\p{L}][\p{L}' -]+$/u, "Ville invalide.")
  .refine(
    (value) => (value.match(/[aeiouyàâäéèêëîïôöùûüÿ]/gi) || []).length >= 2,
    "Ville invalide.",
  );

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(99),
      }),
    )
    .min(1),
  shippingAddress: z.object({
    firstName: personName,
    lastName: personName,
    address: z
      .string()
      .trim()
      .min(8)
      .max(200)
      .regex(/[\p{L}\d]/u, "Adresse invalide.")
      .refine(
        (value) => /\d/.test(value) || value.trim().split(/\s+/).length >= 2,
        "Adresse invalide.",
      ),
    city: cityName,
    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+221[ -]?)?7[05678](?:[ -]?\d{3})(?:[ -]?\d{2})(?:[ -]?\d{2})$/,
        "Numéro de téléphone invalide.",
      ),
  }),
  shippingMode: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["card", "orange", "wave", "cash"]),
  promoCode: z.string().trim().max(40).optional().default(""),
  useLoyaltyPoints: z.boolean().optional().default(false),
});

const updateStatusSchema = z.object({
  status: z.enum(["En attente", "Payé", "En cours", "Livré", "Annulé"]),
});

function toPublicOrder(order) {
  const value = order.toObject ? order.toObject() : order;
  return {
    id: value._id,
    orderNumber: value.orderNumber,
    customerName: value.customerName,
    customerEmail: value.customerEmail,
    customerAvatar: value.user?.avatar || value.customerAvatar || null,
    userId: value.user,
    items: value.items,
    shippingAddress: value.shippingAddress,
    shippingMode: value.shippingMode,
    paymentMethod: value.paymentMethod,
    subtotal: value.subtotal,
    shippingFee: value.shippingFee,
    loyaltyDiscount: value.discount,
    total: value.total,
    status: value.status,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function validationError(response, result) {
  return response.status(400).json({
    message: "Données invalides.",
    errors: result.error.issues.map((issue) => issue.message),
  });
}

export async function createOrder(request, response) {
  const result = createOrderSchema.safeParse(request.body);
  if (!result.success) return validationError(response, result);

  const quantities = new Map();
  for (const item of result.data.items) {
    quantities.set(
      item.productId,
      (quantities.get(item.productId) || 0) + item.quantity,
    );
  }

  const resolvedItems = [];
  for (const [productId, quantity] of quantities) {
    const product = await Product.findById(productId);
    if (!product)
      return response
        .status(400)
        .json({ message: "Un des produits de votre panier n'existe plus." });
    if (product.stock < quantity) {
      return response
        .status(409)
        .json({ message: `Stock insuffisant pour « ${product.name} ».` });
    }
    resolvedItems.push({ product, quantity });
  }

  for (const { product, quantity } of resolvedItems) {
    product.stock -= quantity;
    await product.save();
  }

  const orderItems = resolvedItems.map(({ product, quantity }) => ({
    product: product._id,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity,
  }));
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = result.data.shippingMode === "express" ? 2500 : 0;
  let discount = 0;
  if (result.data.useLoyaltyPoints) {
    const loyaltyUser = await User.findById(request.user.id).select(
      "loyaltyPoints",
    );
    if (!loyaltyUser || loyaltyUser.loyaltyPoints < 1000) {
      return response.status(409).json({
        message: "Vous ne disposez pas de suffisamment de points fidélité.",
      });
    }
    discount += LOYALTY_DISCOUNT;
  }
  if (result.data.promoCode) {
    const promo = await PromoCode.findOne({
      code: result.data.promoCode.toUpperCase(),
      isActive: true,
    });
    if (!promo || (promo.expiresAt && promo.expiresAt < new Date())) {
      return response
        .status(400)
        .json({ message: "Code promo invalide ou expiré." });
    }
    discount += promo.discountAmount;
  }

  const order = await Order.create({
    orderNumber: `SF-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`,
    user: request.user.id,
    customerName: request.user.name,
    customerEmail: request.user.email,
    items: orderItems,
    shippingAddress: result.data.shippingAddress,
    shippingMode: result.data.shippingMode,
    paymentMethod: result.data.paymentMethod,
    subtotal,
    shippingFee,
    discount,
    total: Math.max(0, subtotal + shippingFee - discount),
  });

  if (result.data.useLoyaltyPoints) {
    await User.findOneAndUpdate(
      { _id: request.user.id, loyaltyPoints: { $gte: 1000 } },
      {
        $inc: { loyaltyPoints: -1000 },
        $push: {
          loyaltyHistory: {
            description: `Remise fidélité - ${order.orderNumber}`,
            points: -1000,
            type: "negative",
          },
        },
      },
    );
  }

  await createNotification({
    user: request.user.id,
    category: "Commandes",
    title: "Commande confirmée",
    text: `Votre commande ${order.orderNumber} a été validée avec succès.`,
  });

  return response.status(201).json({ order: toPublicOrder(order) });
}

export async function listMyOrders(request, response) {
  const orders = await Order.find({ user: request.user.id })
    .populate("user", "avatar")
    .sort({ createdAt: -1 });
  return response.json({ orders: orders.map(toPublicOrder) });
}

export async function listAllOrders(request, response) {
  const orders = await Order.find()
    .populate("user", "avatar")
    .sort({ createdAt: -1 });
  return response.json({ orders: orders.map(toPublicOrder) });
}

export async function getOrder(request, response) {
  const order = await Order.findById(request.params.id).populate(
    "user",
    "avatar",
  );
  if (!order) {
    return response.status(404).json({ message: "Commande introuvable." });
  }
  return response.json({ order: toPublicOrder(order) });
}

export async function updateOrderStatus(request, response) {
  const result = updateStatusSchema.safeParse(request.body);
  if (!result.success) return validationError(response, result);
  const order = await Order.findById(request.params.id);
  if (!order)
    return response.status(404).json({ message: "Commande introuvable." });

  const wasDelivered = order.status === "Livré";
  order.status = result.data.status;
  if (!wasDelivered && order.status === "Livré" && !order.pointsAwarded) {
    const points = Math.floor(order.subtotal / 100);
    if (points > 0) {
      await User.findByIdAndUpdate(order.user, {
        $inc: { loyaltyPoints: points },
        $push: {
          loyaltyHistory: {
            description: `Commande ${order.orderNumber}`,
            points,
            type: "positive",
          },
        },
      });
    }
    order.pointsAwarded = true;
  }
  await order.save();
  await createNotification({
    user: order.user,
    category: "Commandes",
    title: "Statut de commande mis à jour",
    text: `La commande ${order.orderNumber} est maintenant : ${order.status}.`,
  });
  return response.json({ order: toPublicOrder(order) });
}

export async function deleteOrder(request, response) {
  const order = await Order.findByIdAndDelete(request.params.id);
  if (!order)
    return response.status(404).json({ message: "Commande introuvable." });
  return response.status(204).send();
}

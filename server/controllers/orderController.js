import { z } from "zod";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const shippingAddressSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis."),
  lastName: z.string().trim().min(1, "Le nom est requis."),
  address: z.string().trim().min(1, "L'adresse est requise."),
  city: z.string().trim().min(1, "La ville est requise."),
  phone: z.string().trim().min(1, "Le téléphone est requis."),
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1, "Le panier est vide."),
  shippingAddress: shippingAddressSchema,
  shippingMode: z.enum(["standard", "express"]).default("standard"),
  paymentMethod: z.enum(["card", "orange", "wave", "cash"]),
  useLoyaltyPoints: z.boolean().optional().default(false),
});

const LOYALTY_DISCOUNT = 5000; // Simplifié pour l'instant : la vraie gestion de solde de points viendra plus tard.

// Ajoute un numéro de commande lisible (dérivé de l'id, jamais stocké en base)
// et aplatit les infos utiles pour l'affichage front (nombre d'articles...).
function toPublicOrder(order) {
  const obj = order.toObject ? order.toObject() : order;
  const itemsCount = obj.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: obj._id,
    orderNumber: `CMD-${String(obj._id).slice(-6).toUpperCase()}`,
    customerName: obj.customerName,
    customerEmail: obj.customerEmail,
    items: obj.items,
    itemsCount,
    shippingAddress: obj.shippingAddress,
    shippingMode: obj.shippingMode,
    paymentMethod: obj.paymentMethod,
    subtotal: obj.subtotal,
    shippingFee: obj.shippingFee,
    discount: obj.discount,
    total: obj.total,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

export async function createOrder(request, response) {
  const parseResult = createOrderSchema.safeParse(request.body);
  if (!parseResult.success) {
    return response.status(400).json({
      message: "Données de commande invalides.",
      errors: parseResult.error.issues.map((issue) => issue.message),
    });
  }

  const { items, shippingAddress, shippingMode, paymentMethod, useLoyaltyPoints } =
    parseResult.data;

  // 1er passage : on vérifie TOUT (existence + stock) avant de toucher à quoi
  // que ce soit, pour ne jamais décrémenter un stock si la commande va échouer.
  const resolvedItems = [];
  for (const { productId, quantity } of items) {
    const product = await Product.findById(productId);
    if (!product) {
      return response
        .status(400)
        .json({ message: `Un des produits de votre panier n'existe plus.` });
    }
    if (product.stock < quantity) {
      return response.status(400).json({
        message: `Stock insuffisant pour "${product.name}" (${product.stock} disponible(s)).`,
      });
    }
    resolvedItems.push({ product, quantity });
  }

  // 2e passage : décrément réel du stock, uniquement une fois tout validé.
  for (const { product, quantity } of resolvedItems) {
    product.stock -= quantity;
    await product.save();
  }

  const orderItems = resolvedItems.map(({ product, quantity }) => ({
    product: product._id,
    name: product.name,
    image: product.image,
    price: product.price, // prix réel côté serveur, jamais celui envoyé par le client
    quantity,
  }));

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingMode === "express" ? 2500 : 0;
  const discount = useLoyaltyPoints ? LOYALTY_DISCOUNT : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const order = await Order.create({
    user: request.user.id,
    customerName: request.user.name,
    customerEmail: request.user.email,
    items: orderItems,
    shippingAddress,
    shippingMode,
    paymentMethod,
    subtotal,
    shippingFee,
    discount,
    total,
  });

  return response.status(201).json({ order: toPublicOrder(order) });
}

export async function listMyOrders(request, response) {
  const orders = await Order.find({ user: request.user.id }).sort({ createdAt: -1 });
  return response.json({ orders: orders.map(toPublicOrder) });
}

export async function listAllOrders(request, response) {
  const orders = await Order.find().sort({ createdAt: -1 });
  return response.json({ orders: orders.map(toPublicOrder) });
}

export async function getOrder(request, response) {
  const order = await Order.findById(request.params.id);
  if (!order) {
    return response.status(404).json({ message: "Commande introuvable." });
  }

  const isOwner = String(order.user) === String(request.user.id);
  if (!isOwner && request.user.role !== "ADMIN") {
    return response.status(403).json({ message: "Accès non autorisé à cette commande." });
  }

  return response.json({ order: toPublicOrder(order) });
}

const updateStatusSchema = z.object({
  status: z.enum(["En attente", "Payé", "En cours", "Livré", "Annulé"]),
});

export async function updateOrderStatus(request, response) {
  const parseResult = updateStatusSchema.safeParse(request.body);
  if (!parseResult.success) {
    return response.status(400).json({
      message: "Statut invalide.",
      errors: parseResult.error.issues.map((issue) => issue.message),
    });
  }

  const order = await Order.findById(request.params.id);
  if (!order) {
    return response.status(404).json({ message: "Commande introuvable." });
  }

  order.status = parseResult.data.status;
  await order.save();

  return response.json({ order: toPublicOrder(order) });
}

export async function deleteOrder(request, response) {
  const order = await Order.findByIdAndDelete(request.params.id);
  if (!order) {
    return response.status(404).json({ message: "Commande introuvable." });
  }
  return response.status(204).send();
}

import path from "node:path";
import fs from "node:fs/promises";
import { z } from "zod";
import Product from "../models/Product.js";
import { PRODUCTS_UPLOAD_DIR } from "../config/uploads.js";

// Schéma de validation des champs texte envoyés en multipart/form-data.
// z.coerce car FormData transporte tout sous forme de chaînes de caractères.
const productBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(150),
    sku: z.string().trim().min(1, "Le SKU est requis.").max(60),
    category: z.string().trim().min(1, "La catégorie est requise.").max(80),
    price: z.coerce.number().min(0, "Le prix doit être positif."),
    stock: z.coerce.number().int().min(0, "Le stock doit être positif ou nul."),
    // Champs optionnels : chaîne vide côté FormData -> traités comme absents.
    badge: z.string().trim().min(1).optional(),
    description: z.string().trim().max(1000).optional(),
    oldPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  })
  .refine(
    (data) =>
      !data.oldPrice || date.oldPrice === "" || date.oldPrice > date.price,
    {
      message: "Le prix barré doit être supérieur au prix actuel.",
      path: ["oldPrice"],
    },
  );

function toPublicProduct(product) {
  const obj = product.toObject ? product.toObject() : product;
  return {
    id: obj._id,
    name: obj.name,
    sku: obj.sku,
    category: obj.category,
    price: obj.price,
    oldPrice: obj.oldPrice || null,
    description: obj.description || "",
    stock: obj.stock,
    badge: obj.badge || null,
    image: obj.image,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

// Supprime le fichier image du disque, sans jamais faire échouer l'appelant
// si le fichier n'existe déjà plus (best-effort).
async function deleteImageFile(imagePath) {
  if (!imagePath) return;
  try {
    const filename = path.basename(imagePath);
    await fs.unlink(path.join(PRODUCTS_UPLOAD_DIR, filename));
  } catch {
    // Fichier déjà absent ou inaccessible : rien à faire de plus.
  }
}

export async function listProducts(request, response) {
  const { category, search } = request.query;
  const filter = {};

  if (category && category !== "Toutes") {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return response.json({ products: products.map(toPublicProduct) });
}

export async function getProduct(request, response) {
  const product = await Product.findById(request.params.id);
  if (!product) {
    return response.status(404).json({ message: "Produit introuvable." });
  }
  return response.json({ product: toPublicProduct(product) });
}

export async function createProduct(request, response) {
  const parseResult = productBodySchema.safeParse(request.body);
  if (!parseResult.success) {
    // Le fichier a déjà été écrit sur le disque par multer à ce stade :
    // si la validation des champs échoue, on nettoie pour ne pas laisser d'orphelin.
    if (request.file) await deleteImageFile(request.file.filename);
    return response.status(400).json({
      message: "Données invalides.",
      errors: parseResult.error.issues.map((issue) => issue.message),
    });
  }

  const image = request.file
    ? `/uploads/products/${request.file.filename}`
    : null;

  const product = await Product.create({
    ...parseResult.data,
    badge: parseResult.data.badge || null,
    description: parseResult.data.description || "",
    oldprice: parseResult.data.oldPrice || null,
    image,
  });

  return response.status(201).json({ product: toPublicProduct(product) });
}

export async function updateProduct(request, response) {
  const parseResult = productBodySchema.safeParse(request.body);
  if (!parseResult.success) {
    if (request.file) await deleteImageFile(request.file.filename);
    return response.status(400).json({
      message: "Données invalides.",
      errors: parseResult.error.issues.map((issue) => issue.message),
    });
  }

  const product = await Product.findById(request.params.id);
  if (!product) {
    if (request.file) await deleteImageFile(request.file.filename);
    return response.status(404).json({ message: "Produit introuvable." });
  }

  // Une nouvelle image remplace l'ancienne (qui est alors supprimée du disque).
  // Sans nouveau fichier, l'image existante est conservée telle quelle.
  if (request.file) {
    await deleteImageFile(product.image);
    product.image = `/uploads/products/${request.file.filename}`;
  }

  product.name = parseResult.data.name;
  product.sku = parseResult.data.sku;
  product.category = parseResult.data.category;
  product.price = parseResult.data.price;
  product.stock = parseResult.data.stock;
  product.badge = parseResult.data.badge || null;
  product.description = parseResult.data.description || "";
  product.oldprice = parseResult.data.oldPrice || null;

  await product.save();

  return response.json({ product: toPublicProduct(product) });
}

export async function deleteProduct(request, response) {
  const product = await Product.findByIdAndDelete(request.params.id);
  if (!product) {
    return response.status(404).json({ message: "Produit introuvable." });
  }

  await deleteImageFile(product.image);

  return response.status(204).send();
}

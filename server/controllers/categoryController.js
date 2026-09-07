import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import Category from "../models/Category.js";
import { CATEGORIES_UPLOAD_DIR } from "../config/uploads.js";

const defaults = [
  [
    "Électronique",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
  ],
  [
    "Accessoires",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80",
  ],
  [
    "Mobilier",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
  ],
  [
    "Beauté",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80",
  ],
  [
    "Mode & Vêtements",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80",
  ],
  [
    "Sport & Loisirs",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80",
  ],
  [
    "Cuisine & Maison",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80",
  ],
  [
    "Informatique",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=80",
  ],
];

function publicCategory(category) {
  return {
    id: category._id,
    name: category.name,
    image: category.image,
    order: category.order,
  };
}

async function getOrSeedCategories() {
  let categories = await Category.find().sort({ order: 1, createdAt: 1 });
  if (categories.length === 0) {
    await Category.insertMany(
      defaults.map(([name, image], order) => ({ name, image, order })),
    );
    categories = await Category.find().sort({ order: 1, createdAt: 1 });
  }
  return categories;
}

export async function listCategories(request, response) {
  const categories = await getOrSeedCategories();
  return response.json({ categories: categories.map(publicCategory) });
}

const updateSchema = z.object({ name: z.string().trim().min(2).max(80) });

export async function updateCategory(request, response) {
  const result = updateSchema.safeParse(request.body);
  if (!result.success)
    return response.status(400).json({ message: "Nom de catégorie invalide." });
  const category = await Category.findById(request.params.id);
  if (!category)
    return response.status(404).json({ message: "Catégorie introuvable." });
  if (request.file) {
    if (category.image.startsWith("/uploads/categories/")) {
      await fs
        .unlink(path.join(CATEGORIES_UPLOAD_DIR, path.basename(category.image)))
        .catch(() => {});
    }
    category.image = `/uploads/categories/${request.file.filename}`;
  }
  category.name = result.data.name;
  await category.save();
  return response.json({ category: publicCategory(category) });
}

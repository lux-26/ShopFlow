import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Les fichiers sont stockés sur le disque du serveur, dans server/uploads/products.
// Servis ensuite en statique via app.use("/uploads", ...) dans app.js.
export const PRODUCTS_UPLOAD_DIR = path.join(
  __dirname,
  "..",
  "uploads",
  "products",
);
export const CATEGORIES_UPLOAD_DIR = path.join(
  __dirname,
  "..",
  "uploads",
  "categories",
);
export const PROFILES_UPLOAD_DIR = path.join(
  __dirname,
  "..",
  "uploads",
  "profiles",
);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, PRODUCTS_UPLOAD_DIR);
  },
  filename: (request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const categoryStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    fs.mkdir(CATEGORIES_UPLOAD_DIR, { recursive: true })
      .then(() => callback(null, CATEGORIES_UPLOAD_DIR))
      .catch(callback);
  },
  filename: (request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const profileStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    fs.mkdir(PROFILES_UPLOAD_DIR, { recursive: true })
      .then(() => callback(null, PROFILES_UPLOAD_DIR))
      .catch(callback);
  },
  filename: (request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

function fileFilter(request, file, callback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return callback(
      new Error(
        "Format d'image non supporté (jpg, png, webp ou gif uniquement).",
      ),
    );
  }
  callback(null, true);
}

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo maximum
});

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

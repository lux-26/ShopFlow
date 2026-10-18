import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configuration officielle Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Stockage en mémoire RAM
const storage = multer.memoryStorage();

export function fileFilter(request, file, callback) {
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

export const uploadCategoryImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Fonction d'envoi direct du buffer vers Cloudinary
export async function uploadToCloudinary(
  fileBuffer,
  folder = "shopflow_products",
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );
    stream.end(fileBuffer);
  });
}
// Ajoute ces exports en bas de ton fichier de configuration actuel
export const PRODUCTS_UPLOAD_DIR = "/tmp";
export const CATEGORIES_UPLOAD_DIR = "/tmp";
export const PROFILES_UPLOAD_DIR = "/tmp";

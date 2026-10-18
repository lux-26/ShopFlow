import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configuration de Cloudinary avec les variables du fichier .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration du stockage cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shopflow_products",
    format: async (req, file) => "png", // ou supprime simplement la ligne allowed_formats
    public_id: (req, file) =>
      Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const upload = multer({ storage: storage });

export { upload, cloudinary };

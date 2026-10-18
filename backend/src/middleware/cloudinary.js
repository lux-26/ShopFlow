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
    format: async (req, file) => "png",
    public_id: (req, file) => {
      // Nettoie le nom : remplace les espaces par des tirets bas et passe en minuscules
      const cleanName = file.originalname
        .split(".")[0]
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();
      return `${Date.now()}-${cleanName}`;
    },
  },
});

const upload = multer({ storage: storage });

export { upload, cloudinary };

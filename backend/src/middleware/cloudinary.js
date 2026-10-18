const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

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
    folder: "shopflow_products", // Nom du dossier de destination sur Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

export { upload, cloudinary };

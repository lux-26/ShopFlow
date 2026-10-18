import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import path from "path";

// Configuration officielle de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage temporaire local dans /tmp (obligatoire sur Render)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = "/tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${Date.now()}-${cleanName}${ext}`);
  },
});

const upload = multer({ storage: storage });

export { upload, cloudinary };

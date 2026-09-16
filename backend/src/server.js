import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers statiques du build Vite/React
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const port = Number(process.env.PORT) || 5000;

if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET.includes("remplacez-par")
) {
  throw new Error("Définissez une JWT_SECRET robuste dans le fichier .env.");
}

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API ShopFlow disponible sur http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Impossible de démarrer l'API :", error.message);
    process.exit(1);
  });

import "dotenv/config";
import argon2 from "argon2";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import User from "../models/User.js";

const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASSWORD || ADMIN_PASSWORD.includes("remplacez-par")) {
  throw new Error("Définissez ADMIN_NAME, ADMIN_EMAIL et ADMIN_PASSWORD dans le fichier .env.");
}

try {
  await connectDatabase();

  const password = await argon2.hash(ADMIN_PASSWORD);
  const user = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      name: ADMIN_NAME,
      password,
      role: "ADMIN",
      isActive: true,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );

  console.log(`Compte administrateur prêt : ${user.email}`);
} finally {
  await mongoose.disconnect();
}

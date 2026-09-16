import mongoose from "mongoose";

export async function connectDatabase() {
  const databaseUrl = process.env.MONGODB_URI;

  if (!databaseUrl) {
    throw new Error("La variable MONGODB_URI est requise.");
  }

  await mongoose.connect(databaseUrl);
  console.log(`MongoDB connecté : ${mongoose.connection.host}`);
}

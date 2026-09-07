import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import {
  clearSessionCookie,
  createToken,
  getSessionToken,
  publicUser,
  setSessionCookie,
} from "../utils/auth.js";
import fs from "node:fs/promises";
import path from "node:path";
import { PROFILES_UPLOAD_DIR } from "../config/uploads.js";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(80),
  email: z.string().trim().email("Adresse e-mail invalide.").max(254),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide.").max(254),
  password: z.string().min(1, "Mot de passe requis.").max(128),
});

function validate(schema, payload, response) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    response.status(400).json({
      message: "Les informations envoyées sont invalides.",
      errors: result.error.issues.map((issue) => issue.message),
    });
    return null;
  }

  return result.data;
}

async function sendAuthenticatedUser(response, user, statusCode = 200) {
  user.lastSeenAt = new Date();
  await user.save();
  const token = createToken(user);
  setSessionCookie(response, token);
  return response.status(statusCode).json({ user: publicUser(user) });
}

export async function register(request, response) {
  const data = validate(registerSchema, request.body, response);
  if (!data) return;

  const email = data.email.toLowerCase();
  const existingUser = await User.exists({ email });

  if (existingUser) {
    return response
      .status(409)
      .json({ message: "Cette adresse e-mail est déjà utilisée." });
  }

  const password = await argon2.hash(data.password);
  const user = await User.create({ name: data.name, email, password });
  return sendAuthenticatedUser(response, user, 201);
}

export async function login(request, response) {
  const data = validate(loginSchema, request.body, response);
  if (!data) return;

  const user = await User.findOne({ email: data.email.toLowerCase() }).select(
    "+password",
  );
  const passwordMatches =
    user && (await argon2.verify(user.password, data.password));

  if (!passwordMatches || !user.isActive) {
    return response
      .status(401)
      .json({ message: "Adresse e-mail ou mot de passe incorrect." });
  }

  return sendAuthenticatedUser(response, user);
}

export async function logout(request, response) {
  const token = getSessionToken(request);
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(payload.sub, { lastSeenAt: null });
    } catch {
      // Le cookie est supprimé même si le token est déjà expiré ou invalide.
    }
  }
  clearSessionCookie(response);
  return response.status(204).send();
}

export async function touchPresence(request, response) {
  await User.findByIdAndUpdate(request.user._id, { lastSeenAt: new Date() });
  return response.status(204).send();
}

export async function uploadAvatar(request, response) {
  if (!request.file) {
    return response.status(400).json({ message: "Une image est requise." });
  }

  if (request.user.avatar) {
    await fs
      .unlink(
        path.join(PROFILES_UPLOAD_DIR, path.basename(request.user.avatar)),
      )
      .catch(() => {});
  }
  request.user.avatar = `/uploads/profiles/${request.file.filename}`;
  await request.user.save();
  return response.json({ user: publicUser(request.user) });
}

export function getCurrentUser(request, response) {
  return response.json({ user: publicUser(request.user) });
}

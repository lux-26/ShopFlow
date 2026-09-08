import argon2 from "argon2";
import crypto from "node:crypto";
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
import { sendEmail, buildResetPasswordEmail } from "../utils/email.js";
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

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide.").max(254),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Lien de réinitialisation invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(128),
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

// Message volontairement identique que l'email existe ou non, pour ne pas
// permettre à quelqu'un de deviner quels emails sont inscrits (énumération).
const FORGOT_PASSWORD_GENERIC_MESSAGE =
  "Si un compte existe avec cette adresse, un email de réinitialisation vient d'être envoyé.";

export async function forgotPassword(request, response) {
  const data = validate(forgotPasswordSchema, request.body, response);
  if (!data) return;

  const email = data.email.toLowerCase();
  const user = await User.findOne({ email });

  // On ne révèle jamais si l'email existe ou non : même réponse dans les deux cas.
  if (!user) {
    return response.json({ message: FORGOT_PASSWORD_GENERIC_MESSAGE });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
  await user.save();

  const clientOrigin = (
    process.env.CLIENT_URL || "http://localhost:5173"
  ).split(",")[0];
  const resetLink = `${clientOrigin}/reset-password?token=${rawToken}`;
  const { subject, html } = buildResetPasswordEmail(resetLink);
  const { sent } = await sendEmail({ to: user.email, subject, html });

  const responseBody = { message: FORGOT_PASSWORD_GENERIC_MESSAGE };

  // Filet de sécurité pour le développement local SANS service email configuré :
  // le lien est renvoyé directement dans la réponse (jamais en production).
  if (!sent && process.env.NODE_ENV !== "production") {
    responseBody.devResetLink = resetLink;
  }

  return response.json(responseBody);
}

export async function resetPassword(request, response) {
  const data = validate(resetPasswordSchema, request.body, response);
  if (!data) return;

  const tokenHash = crypto
    .createHash("sha256")
    .update(data.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return response.status(400).json({
      message: "Ce lien de réinitialisation est invalide ou a expiré.",
    });
  }

  user.password = await argon2.hash(data.password);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpires = null;
  await user.save();

  return response.json({ message: "Mot de passe réinitialisé avec succès." });
}

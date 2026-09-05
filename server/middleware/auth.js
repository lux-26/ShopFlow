import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getSessionToken } from "../utils/auth.js";

export async function requireAuth(request, response, next) {
  try {
    const token = getSessionToken(request);

    if (!token) {
      return response.status(401).json({ message: "Authentification requise." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      return response.status(401).json({ message: "Session invalide ou expirée." });
    }

    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ message: "Session invalide ou expirée." });
  }
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: "Accès non autorisé." });
    }

    return next();
  };
}

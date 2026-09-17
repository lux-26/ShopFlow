import jwt from "jsonwebtoken";

const SESSION_COOKIE = "shopflow_session";
const REMEMBERED_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function usesCrossSiteCookies() {
  const configuredOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return (
    process.env.NODE_ENV === "production" ||
    configuredOrigins.some((origin) => origin.startsWith("https://"))
  );
}

function getCookieOptions() {
  const crossSite = usesCrossSiteCookies();

  return {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? "none" : "lax",
    path: "/",
  };
}

export function createToken(user, rememberMe = false) {
  return jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    subject: user.id,
    expiresIn: rememberMe ? "7d" : "1d",
  });
}

export function setSessionCookie(response, token, rememberMe = false) {
  const cookieOptions = {
    ...getCookieOptions(),
    ...(rememberMe
      ? { maxAge: REMEMBERED_SESSION_DURATION_MS }
      : {}),
  };

  response.cookie(SESSION_COOKIE, token, cookieOptions);
}

export function clearSessionCookie(response) {
  response.clearCookie(SESSION_COOKIE, getCookieOptions());
}

export function getSessionToken(request) {
  const authorization = request.headers.authorization;

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length);
  }

  return request.cookies[SESSION_COOKIE];
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    avatar: user.avatar || null,
    createdAt: user.createdAt,
  };
}

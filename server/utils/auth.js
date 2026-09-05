import jwt from "jsonwebtoken";

const SESSION_COOKIE = "shopflow_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

export function createToken(user) {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn: "7d" },
  );
}

export function setSessionCookie(response, token) {
  response.cookie(SESSION_COOKIE, token, {
    ...getCookieOptions(),
    maxAge: SESSION_DURATION_MS,
  });
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
    createdAt: user.createdAt,
  };
}

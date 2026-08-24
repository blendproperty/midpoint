import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getAuthSecretBytes } from "@/lib/auth-secret";

export const SESSION_COOKIE = "midpoint_admin_session";

export type Role = "SUPER_ADMIN" | "EDITOR";

export type SessionPayload = {
  sub: string;
  email: string;
  role: Role;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecretBytes());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecretBytes());
    if (!payload.sub || !payload.email || !payload.role) return null;
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

// Server Component / Server Action helper — reads the session cookie via
// next/headers. Not usable in middleware (Edge runtime doesn't support
// next/headers the same way); middleware verifies the JWT directly instead.
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

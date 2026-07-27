import { getSession, type SessionPayload } from "@/lib/auth";

// Defense-in-depth check inside every server action / admin data loader.
// Middleware already blocks unauthenticated requests to /admin and
// /api/admin at the edge, but server actions are worth guarding directly too
// since they're just POSTs to a page route.
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: sign in required");
  }
  return session;
}

export async function requireSuperAdmin(): Promise<SessionPayload> {
  const session = await requireAdmin();
  if (session.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden: super admin only");
  }
  return session;
}

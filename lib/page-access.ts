import { SignJWT, jwtVerify } from "jose";
import { getAuthSecretBytes } from "@/lib/auth-secret";

// Signed, page-specific unlock token. A visitor who enters the correct
// password for a protected Page/PillarPage gets one of these set as a
// cookie (see pageAccessCookieName) so they don't have to re-enter it on
// every request for 24 hours. Scoped per page via the `pageId` claim, so
// unlocking one protected page never unlocks another.
export async function createPageAccessToken(pageId: string): Promise<string> {
  return new SignJWT({ pageId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getAuthSecretBytes());
}

export async function verifyPageAccessToken(token: string | undefined, pageId: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getAuthSecretBytes());
    return payload.pageId === pageId;
  } catch {
    return false;
  }
}

export function pageAccessCookieName(pageId: string) {
  return `mp_page_access_${pageId}`;
}

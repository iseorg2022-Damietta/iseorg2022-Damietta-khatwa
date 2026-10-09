{
  "name": "khatwa-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev", "build": "prisma generate && next build", "start": "next start",
    "db:push": "prisma db push", "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": { "@prisma/client": "^5.19.0", "next": "14.2.5", "react": "18.3.1", "react-dom": "18.3.1" },
  "devDependencies": {
    "prisma": "^5.19.0", "tsx": "^4.16.0", "typescript": "^5.5.4",
    "tailwindcss": "^3.4.10", "postcss": "^8.4.41", "autoprefixer": "^10.4.20",
    "@types/node": "^20", "@types/react": "^18"شimport crypto from "crypto";
import { cookies } from "next/headers";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
const COOKIE = "khatwa_session";
export interface SessionUser { uid: number; role: string; }

export function signSession(p: SessionUser): string {
  const body = Buffer.from(JSON.stringify(p)).toString("base64url");
  return `${body}.${crypto.createHmac("sha256", SECRET).update(body).digest("base64url")}`;
}
export function verifySession(token?: string): SessionUser | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (sig !== crypto.createHmac("sha256", SECRET).update(body).digest("base64url")) return null;
  try { return JSON.parse(Buffer.from(body, "base64url").toString()); } catch { return null; }
}
export function getSessionUser(): SessionUser | null { return verifySession(cookies().get(COOKIE)?.value); }
export function setSessionCookie(p: SessionUser) {
  cookies().set(COOKIE, signSession(p), { httpOnly: true, sameSite: "lax", path: "/",
    maxAge: 60 * 60 * 24 * 60, secure: process.env.NODE_ENV === "production" });
}
export function clearSessionCookie() { cookies().delete(COOKIE); }
  }
}
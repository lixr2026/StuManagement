import { cookies } from "next/headers";

/**
 * 极简登录态：用 HMAC 签名的 cookie 存 username。
 * 后续可替换为 NextAuth / Supabase Auth。
 */

function getSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-fallback-secret";
  return secret;
}

async function hmac(value: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Buffer.from(new Uint8Array(sig)).toString("base64");
}

export async function createSession(username: string): Promise<void> {
  const payload = `${username}`;
  const sig = await hmac(payload);
  const token = `${payload}:${sig}`;
  const store = await cookies();
  store.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 小时
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSession(): Promise<string | null> {
  const store = await cookies();
  const token = store.get("session")?.value;
  if (!token) return null;
  const idx = token.lastIndexOf(":");
  if (idx === -1) return null;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = await hmac(payload);
  if (sig !== expected) return null;
  return payload || null;
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete("session");
}
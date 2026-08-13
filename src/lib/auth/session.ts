/**
 * Stateless admin session tokens — HMAC-SHA256 signed payloads using
 * the Web Crypto API, so the same module works in the edge runtime
 * (src/proxy.ts) and in Node.js server code. No database involved.
 *
 * Token format: `<base64url json payload>.<base64url signature>`
 * Payload: `{ "sub": "<adminUserId>", "exp": <epoch ms> }`
 */

export const SESSION_COOKIE_NAME = "efa_admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 24 ? secret : null;
}

async function getHmacKey(): Promise<CryptoKey | null> {
  const secret = getSecret();
  if (!secret) return null;
  try {
    return await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  } catch {
    return null;
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

type SessionPayload = { sub: string; exp: number };

/**
 * Creates a signed session token for the given admin user id.
 * Returns null when AUTH_SECRET is missing or unusable — callers fail
 * the login rather than issuing an unsigned token.
 */
export async function createSessionToken(userId: string): Promise<string | null> {
  const key = await getHmacKey();
  if (!key) return null;

  const payload: SessionPayload = {
    sub: userId,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64)
  );
  return `${payloadB64}.${toBase64Url(new Uint8Array(signature))}`;
}

/**
 * Verifies a session token and returns its admin user id.
 * Fails closed: malformed tokens, bad signatures, expired tokens and a
 * missing AUTH_SECRET all return null.
 */
export async function verifySessionToken(
  token: string | undefined
): Promise<{ sub: string } | null> {
  if (!token) return null;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) return null;

  const payloadB64 = token.slice(0, separatorIndex);
  const signatureB64 = token.slice(separatorIndex + 1);

  const key = await getHmacKey();
  if (!key) return null;

  let signature: Uint8Array<ArrayBuffer>;
  try {
    signature = fromBase64Url(signatureB64);
  } catch {
    return null;
  }

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(payloadB64)
  );
  if (!valid) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(decoder.decode(fromBase64Url(payloadB64)));
  } catch {
    return null;
  }
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.sub !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }
  if (payload.exp <= Date.now()) return null;

  return { sub: payload.sub };
}

export function sessionCookieOptions(): {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
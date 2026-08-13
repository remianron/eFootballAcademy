import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

/**
 * Admin password hashing — Node built-in scrypt (no external deps).
 * Node-only module: used by server actions, routes and the seed script,
 * never by the proxy or client code.
 */

const SCRYPT_N = 16384; // 2^14 — reasonable for admin login on shared hosting
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

const PREFIX = "s2";
const MAX_PASSWORD_LENGTH = 128;

function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      keylen,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      }
    );
  });
}

function toBase64(value: Buffer): string {
  return value.toString("base64");
}

/**
 * Hashes a password for storage. Produces
 * `s2$<base64 salt>$<base64 derived key>` with fixed scrypt parameters.
 */
export async function hashPassword(password: string): Promise<string> {
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error("Password is too long.");
  }
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  return [PREFIX, toBase64(salt), toBase64(derived)].join("$");
}

/**
 * Verifies a password against a stored hash in constant time.
 * Returns false for malformed stored values so a corrupt row never
 * presents a distinguishable failure mode.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (password.length > MAX_PASSWORD_LENGTH) return false;
  const [prefix, saltB64, hashB64] = stored.split("$");
  if (prefix !== PREFIX || !saltB64 || !hashB64) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltB64, "base64");
    expected = Buffer.from(hashB64, "base64");
  } catch {
    return false;
  }
  if (salt.length !== SALT_LENGTH || expected.length !== KEY_LENGTH) {
    return false;
  }

  const actual = await scryptAsync(password, salt, KEY_LENGTH);
  return timingSafeEqual(actual, expected);
}
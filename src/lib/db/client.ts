import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { DataSourceUnavailableError } from "@/lib/db/errors";

/**
 * Prisma client singleton (driver adapter for MySQL/MariaDB), resolved
 * lazily.
 *
 * - Hostinger Web/Cloud hosting exposes MySQL (MariaDB); the mariadb
 *   driver adapter supports both MySQL and MariaDB.
 * - No connection is opened at import time and no client is constructed
 *   until the first query, so the app builds and runs without a local
 *   database. A missing DATABASE_URL surfaces as a
 *   DataSourceUnavailableError at query time instead of crashing on
 *   import.
 * - Safe against Next.js dev hot-reload duplication via globalThis.
 */

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new DataSourceUnavailableError(
      "DATABASE_URL is not set. Copy .env.example to .env and configure it."
    );
  }
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  const existing = globalForPrisma.prisma;
  if (existing) return existing;
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

/**
 * Lazily resolved Prisma client. Repositories keep using `prisma`
 * exactly as before; the client itself is only created on first query.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
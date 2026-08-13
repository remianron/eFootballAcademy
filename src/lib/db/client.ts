import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DataSourceUnavailableError } from "@/lib/db/errors";

/**
 * Prisma client singleton (driver adapter for PostgreSQL/Neon), resolved
 * lazily.
 *
 * - Neon exposes a pooled connection string (DATABASE_URL, for runtime
 *   queries) and a direct connection string (DIRECT_URL, used by the
 *   Prisma CLI for migrations). This client always uses the pooled
 *   DATABASE_URL.
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
  const adapter = new PrismaPg({ connectionString: url });
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
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Prisma client singleton (driver adapter for MySQL/MariaDB).
 *
 * - Hostinger Web/Cloud hosting exposes MySQL (MariaDB); the mariadb
 *   driver adapter supports both MySQL and MariaDB.
 * - No connection is opened at import time; the pool connects lazily.
 * - Safe against Next.js dev hot-reload duplication via globalThis.
 */

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and configure it."
    );
  }
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
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
 *
 * Connection lifecycle:
 * - The Neon compute endpoint auto-suspends after a few minutes without
 *   connections, and establishing a fresh connection afterwards can take
 *   many seconds (measured 1-11s, occasional stalls beyond 30s). To keep
 *   requests fast and reliable the pool is kept warm: idle clients are
 *   never pruned (idleTimeoutMillis: 0), connection attempts are bounded
 *   (connectionTimeoutMillis: 30s) so a stalled handshake loads slowly
 *   instead of erroring, and a periodic keep-alive query prevents the
 *   compute from suspending while the app runs.
 * - When the runtime starts (dev server or next start) the client is
 *   created eagerly and the pool is warmed with a handful of connections
 *   before requests arrive, so request-time handshakes are rare. During
 *   `next build` (NEXT_PHASE=phase-production-build) and when
 *   DATABASE_URL is absent this warm-up is skipped entirely.
 * - Every 30s all pooled connections are exercised with a lightweight
 *   query. This keeps the PgBouncer server-side mappings warm and
 *   replaces any connection the pooler dropped before a request can
 *   encounter it.
 */

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new DataSourceUnavailableError(
      "DATABASE_URL is not set. Copy .env.example to .env and configure it."
    );
  }
  const adapter = new PrismaPg({
    connectionString: normalizeSslMode(url),
    connectionTimeoutMillis: 30_000,
    idleTimeoutMillis: 0,
    max: 10,
  });
  return new PrismaClient({ adapter });
}

function startKeepAlive(client: PrismaClient): void {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  client.$connect().catch(() => {});
  const ping = () =>
    Promise.allSettled(
      Array.from({ length: 8 }, () => client.$queryRaw`SELECT 1`)
    );
  ping();
  const timer = setInterval(ping, 30_000);
  if (typeof timer.unref === "function") timer.unref();
}

/**
 * pg-connection-string (pg >= 8.13) aliases the `prefer`, `require` and
 * `verify-ca` SSL modes to `verify-full` and emits a deprecation warning
 * for them. Neon connection strings conventionally use `sslmode=require`;
 * normalize it to the explicit modern equivalent so the warning is not
 * emitted while keeping identical semantics: TLS with full certificate
 * verification. Other modes (`disable`, `no-verify`, `verify-full`,
 * `verify-ca` with `sslrootcert`) are left untouched.
 */
function normalizeSslMode(url: string): string {
  return url.replace(
    /(sslmode\s*=\s*)(?:prefer|require|verify-ca)(?=&|$)/gi,
    "$1verify-full"
  );
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  const existing = globalForPrisma.prisma;
  if (existing) return existing;
  const client = createPrismaClient();
  startKeepAlive(client);
  globalForPrisma.prisma = client;
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

if (
  process.env.NEXT_PHASE !== "phase-production-build" &&
  process.env.DATABASE_URL
) {
  getPrismaClient();
}
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let client: PrismaClient | undefined;

function getClient(): PrismaClient {
  if (client) return client;
  client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

/**
 * Neon (serverless Postgres) suspends the database after inactivity. The first
 * query that wakes it can time out / fail to connect, which previously bubbled
 * up as a page-level "Алдаа гарлаа" until the user refreshed. We retry those
 * transient connection errors a few times with a short backoff so the cold
 * start is invisible to the user.
 */
function isTransient(err: any): boolean {
  const code = err?.code;
  if (code === "P1001" || code === "P1002" || code === "P1008" || code === "P1017") return true;
  const msg = String(err?.message ?? "").toLowerCase();
  return (
    msg.includes("can't reach database") ||
    msg.includes("connection") ||
    msg.includes("timed out") ||
    msg.includes("timeout") ||
    msg.includes("econnreset") ||
    msg.includes("terminating connection") ||
    msg.includes("socket")
  );
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries || !isTransient(err)) throw err;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      attempt++;
    }
  }
}

/**
 * Lazy Prisma proxy — the PrismaClient is NOT constructed when this module is
 * imported, only on first property access (e.g. `db.user.findMany`). This keeps
 * the Next.js build's "collect page data" step from instantiating Prisma. Model
 * delegate methods are additionally wrapped with the transient-retry helper.
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const c = getClient() as any;
    const value = c[prop];

    // Client-level functions ($transaction, $connect, $queryRaw, …) — bind as-is.
    if (typeof value === "function") return value.bind(c);

    // Model delegates (db.product, db.user, …) — wrap each query method in retry.
    if (value && typeof value === "object") {
      return new Proxy(value, {
        get(model, mprop) {
          const m = (model as any)[mprop];
          if (typeof m === "function") {
            return (...args: any[]) => withRetry(() => m.apply(model, args));
          }
          return m;
        },
      });
    }

    return value;
  },
});

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
 * Lazy Prisma proxy — the PrismaClient is NOT constructed when this module is
 * imported, only on first property access (e.g. `db.user.findMany`). This keeps
 * the Next.js build's "collect page data" step from instantiating Prisma (which
 * would throw if DATABASE_URL is absent at build time on Vercel).
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const value = (getClient() as any)[prop];
    return typeof value === "function" ? value.bind(getClient()) : value;
  },
});

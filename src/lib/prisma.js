/**
 * Prisma Client singleton for Next.js.
 *
 * In development, Next.js hot-reload creates new module instances on every
 * file change — without this pattern you'd exhaust SQLite connections quickly.
 * This stores the client on the global object so it survives hot reloads.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  let cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).cachedPrisma) {
    (global as any).cachedPrisma = new PrismaClient();
  }
  prisma = (global as any).cachedPrisma;
}

export const db = prisma;

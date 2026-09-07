import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

export type { PrismaClient };

/**
 * Ein Client-Fabrik für Runtime (src/lib/db) und Seed — der Treiber folgt
 * der DATABASE_URL: `file:` startet den SQLite-Dev-Modus, alles andere
 * läuft über Postgres wie in Produktion.
 */
export function resolveDatabaseUrl(): string {
  return (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    "postgresql://dummy:dummy@localhost:5432/dummy"
  );
}

export function createPrismaClient(): PrismaClient {
  const url = resolveDatabaseUrl();

  if (url.startsWith("file:")) {
    return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
  }

  const pool = new Pool({ connectionString: url });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

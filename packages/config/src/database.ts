import { env } from "./env";

export const databaseConfig = {
  url: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
  migrations: {
    directory: "./migrations",
    tableName: "migrations",
  },
  seeds: {
    directory: "./seeds",
  },
} as const;

export const drizzleConfig = {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "pg" as const,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: env.NODE_ENV === "development",
  strict: true,
} as const;

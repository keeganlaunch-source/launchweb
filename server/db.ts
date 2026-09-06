import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const url = process.env.DATABASE_URL;
const isNeon = /neon\.tech|vercel-storage\.com/.test(url);

// Neon (and Vercel Postgres, which is Neon underneath) speaks its own
// WebSocket protocol. Any other Postgres (local, Supabase, Railway, a VPS)
// uses the standard `pg` driver.
let pool: any;
let db: any;

if (isNeon) {
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-serverless");
  const ws = (await import("ws")).default;
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: url });
  db = drizzle({ client: pool, schema });
} else {
  const pg = (await import("pg")).default;
  const { drizzle } = await import("drizzle-orm/node-postgres");
  pool = new pg.Pool({
    connectionString: url,
    ssl: /sslmode=require/.test(url) ? { rejectUnauthorized: false } : undefined,
  });
  db = drizzle(pool, { schema });
}

export { pool, db };

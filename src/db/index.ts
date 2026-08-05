import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/lion_star_auto';

const conn = globalForDb.conn ?? postgres(connectionString, {
  max: 20,
  idle_timeout: 30,
  // ssl: process.env.NODE_ENV === 'production',
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
export * from './schema';
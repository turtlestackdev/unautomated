import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DATABASE_URL } from '@/settings';
import type { DB } from '@/database/schema';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<DB>({
  dialect,
});

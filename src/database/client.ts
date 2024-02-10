import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { DB } from '@/database/schema';
import { DATABASE_URL } from '@/settings';

const file = DATABASE_URL.replace(/^file:/, '');

export const sqliteDatabase = new SQLite(file);

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: sqliteDatabase,
  }),
});

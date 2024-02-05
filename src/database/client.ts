import type { DB } from '@/database/schema';
import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely'

const dialect = new SqliteDialect({
    database: new SQLite(process.env.DATABASE_URL),
})

export const db = new Kysely<DB>({
    dialect,
})
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// Prefer server-side secret when available; fall back to public var for dev only
const DB_URL = process.env.DRIZZLE_DB_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;

if (!DB_URL) {
	console.error('Database URL is not set. Define DRIZZLE_DB_URL (preferred) or NEXT_PUBLIC_DRIZZLE_DB_URL.');
}

const sql = neon(DB_URL);

export const db = drizzle(sql, { schema });
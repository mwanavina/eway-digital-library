const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
const sql = neon(databaseUrl);

async function migrate() {
  try {
    console.log('[v0] Making documents.course_id nullable...');
    await sql`ALTER TABLE documents ALTER COLUMN course_id DROP NOT NULL`;
    console.log('[v0] documents.course_id is now nullable');
  } catch (error) {
    console.error('[v0] Migration error:', error.message || error);
    process.exit(1);
  }
}

migrate();

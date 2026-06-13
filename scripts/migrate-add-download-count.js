const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('[v0] Starting migration: Add download_count column');

    // Add download_count column to documents table
    await sql`
      ALTER TABLE documents
      ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0
    `;

    console.log('[v0] Successfully added download_count column');
    console.log('[v0] Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('[v0] Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();

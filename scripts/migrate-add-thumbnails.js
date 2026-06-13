import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function migrateDatabase() {
  try {
    console.log('[v0] Starting database migration for thumbnails...');

    // Add thumbnail_url column if it doesn't exist
    await sql`
      ALTER TABLE documents 
      ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(512)
    `;
    console.log('[v0] Added thumbnail_url column');

    // Add file_key column to store Uploadthing file key
    await sql`
      ALTER TABLE documents 
      ADD COLUMN IF NOT EXISTS file_key VARCHAR(255)
    `;
    console.log('[v0] Added file_key column');

    // Add thumbnail_key column to store Uploadthing thumbnail file key
    await sql`
      ALTER TABLE documents 
      ADD COLUMN IF NOT EXISTS thumbnail_key VARCHAR(255)
    `;
    console.log('[v0] Added thumbnail_key column');

    // Add upload_status to track processing state
    await sql`
      ALTER TABLE documents 
      ADD COLUMN IF NOT EXISTS upload_status VARCHAR(50) DEFAULT 'pending'
    `;
    console.log('[v0] Added upload_status column');

    // Add error_message for tracking upload failures
    await sql`
      ALTER TABLE documents 
      ADD COLUMN IF NOT EXISTS error_message TEXT
    `;
    console.log('[v0] Added error_message column');

    console.log('[v0] Database migration completed successfully!');
  } catch (error) {
    console.error('[v0] Error during migration:', error);
    process.exit(1);
  }
}

migrateDatabase();

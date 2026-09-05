const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
const sql = neon(databaseUrl);

async function migrate() {
  try {
    console.log('[v0] Starting resource types migration...');

    // Create resource_types table with metadata used by the UI
    await sql`
      CREATE TABLE IF NOT EXISTS resource_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'FileText',
        color VARCHAR(20) DEFAULT '#1782C5',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('[v0] resource_types table created');

    await sql`
      ALTER TABLE resource_types
      ADD COLUMN IF NOT EXISTS slug VARCHAR(100);
    `;
    await sql`
      ALTER TABLE resource_types
      ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT 'FileText';
    `;
    await sql`
      ALTER TABLE resource_types
      ADD COLUMN IF NOT EXISTS color VARCHAR(20) DEFAULT '#1782C5';
    `;

    // Add columns to documents table if they don't exist
    try {
      await sql`
        ALTER TABLE documents 
        ADD COLUMN IF NOT EXISTS resource_type_id INTEGER DEFAULT 1,
        ADD COLUMN IF NOT EXISTS author VARCHAR(255),
        ADD COLUMN IF NOT EXISTS abstract TEXT,
        ADD COLUMN IF NOT EXISTS doi VARCHAR(100),
        ADD COLUMN IF NOT EXISTS publication_date DATE,
        ADD COLUMN IF NOT EXISTS keywords VARCHAR(500)
      `;
      console.log('[v0] documents table columns added');
    } catch (e) {
      console.log('[v0] Columns might already exist, continuing...');
    }

    // Try to add constraint if it doesn't exist
    try {
      await sql`
        ALTER TABLE documents
        ADD CONSTRAINT fk_resource_type FOREIGN KEY (resource_type_id) REFERENCES resource_types(id)
      `;
      console.log('[v0] Foreign key constraint added');
    } catch (e) {
      console.log('[v0] Constraint might already exist, continuing...');
    }

    console.log('[v0] Migration completed successfully');
  } catch (error) {
    console.error('[v0] Migration error:', error.message);
    process.exit(1);
  }
}

migrate();

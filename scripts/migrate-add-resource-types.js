const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('[v0] Starting resource types migration...');

    // Create resource_types table
    await sql`
      CREATE TABLE IF NOT EXISTS resource_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(20),
        color VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('[v0] resource_types table created');

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

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function initializeDatabase() {
  try {
    console.log('[v0] Starting database initialization...')

    // Create schools table
    await sql`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created schools table')

    // Create departments table
    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        school_id INTEGER REFERENCES schools(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created departments table')

    // Create programs table
    await sql`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        department_id INTEGER REFERENCES departments(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created programs table')

    // Create levels table
    await sql`
      CREATE TABLE IF NOT EXISTS levels (
        id SERIAL PRIMARY KEY,
        level_number INTEGER NOT NULL UNIQUE,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created levels table')

    // Create courses table
    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        program_id INTEGER REFERENCES programs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created courses table')

    // Create documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        file_path VARCHAR(512),
        file_size INTEGER,
        course_id INTEGER REFERENCES courses(id),
        level_id INTEGER REFERENCES levels(id),
        year INTEGER,
        semester INTEGER,
        exam_type VARCHAR(50),
        uploaded_by VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created documents table')

    // Create download_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS download_logs (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id),
        user_id VARCHAR(255),
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created download_logs table')

    // Create sessions table (for future auth)
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        token VARCHAR(512) NOT NULL UNIQUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created sessions table')

    // Create users table (for future auth)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255),
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('[v0] Created users table')

    console.log('[v0] Database initialization completed successfully!')
  } catch (error) {
    console.error('[v0] Error initializing database:', error)
    process.exit(1)
  }
}

initializeDatabase()

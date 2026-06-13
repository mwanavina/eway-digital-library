-- MUBAS Digital Library - Database Schema
-- PostgreSQL Schema Definition
-- Created: 2026-06-07

-- ============================================================================
-- TABLE CREATION
-- ============================================================================

-- 1. Schools
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  school_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Programs
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  department_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Courses
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  program_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Levels
CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  level_number INTEGER NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Documents
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  course_id INTEGER NOT NULL,
  level_id INTEGER,
  year INTEGER,
  semester INTEGER,
  exam_type VARCHAR(100),
  file_path VARCHAR(500),
  file_key VARCHAR(500),
  file_size INTEGER,
  thumbnail_url VARCHAR(500),
  thumbnail_key VARCHAR(500),
  upload_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  uploaded_by VARCHAR(255),
  uploaded_at TIMESTAMP,
  error_message TEXT,
  download_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 7. Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. Download Logs
CREATE TABLE IF NOT EXISTS download_logs (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================================
-- INDEX CREATION (for performance optimization)
-- ============================================================================

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_documents_course_id ON documents(course_id);
CREATE INDEX IF NOT EXISTS idx_documents_upload_status ON documents(upload_status);
CREATE INDEX IF NOT EXISTS idx_documents_year ON documents(year);

-- Download log indexes
CREATE INDEX IF NOT EXISTS idx_download_logs_document_id ON download_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_user_id ON download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_downloaded_at ON download_logs(downloaded_at);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Course lookup
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_program_id ON courses(program_id);

-- Organization hierarchy
CREATE INDEX IF NOT EXISTS idx_departments_school_id ON departments(school_id);
CREATE INDEX IF NOT EXISTS idx_programs_department_id ON programs(department_id);

-- ============================================================================
-- CONSTRAINTS AND VALIDATION
-- ============================================================================

-- Add check constraints for valid values
ALTER TABLE documents
ADD CONSTRAINT chk_semester CHECK (semester IS NULL OR semester IN (1, 2));

ALTER TABLE documents
ADD CONSTRAINT chk_upload_status CHECK (upload_status IN ('pending', 'completed', 'failed'));

ALTER TABLE users
ADD CONSTRAINT chk_role CHECK (role IN ('admin', 'user'));

ALTER TABLE levels
ADD CONSTRAINT chk_level_number CHECK (level_number > 0 AND level_number <= 10);

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE schools IS 'Top-level organizational units representing major schools within the institution';
COMMENT ON TABLE departments IS 'Academic departments within schools';
COMMENT ON TABLE programs IS 'Academic programs within departments (e.g., Bachelor of IT, Diploma in IT)';
COMMENT ON TABLE courses IS 'Individual courses within programs';
COMMENT ON TABLE levels IS 'Academic levels (Year 1-5, for categorizing documents)';
COMMENT ON TABLE documents IS 'Educational resources: past papers, journals, dissertations, course outlines, research papers';
COMMENT ON TABLE users IS 'System users: admins and regular users';
COMMENT ON TABLE sessions IS 'User sessions for authentication and authorization';
COMMENT ON TABLE download_logs IS 'Download activity tracking for analytics and audit trails';

-- ============================================================================
-- END OF SCHEMA DEFINITION
-- ============================================================================

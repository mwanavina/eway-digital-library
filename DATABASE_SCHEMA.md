# MUBAS Digital Library - Database Schema

## Overview

The MUBAS Digital Library uses **Neon PostgreSQL** as its primary database. This document provides a comprehensive reference for all tables, columns, relationships, and data types.

**Database Type:** PostgreSQL  
**Hosting:** Neon (Serverless PostgreSQL)  
**Connection:** @neondatabase/serverless  
**Total Tables:** 9  
**Total Relationships:** Hierarchical + Reference  

---

## Table of Contents

1. [Core Tables](#core-tables)
2. [Document Management](#document-management)
3. [User Management](#user-management)
4. [Relationships](#relationships)
5. [Entity Relationship Diagram](#entity-relationship-diagram)
6. [Data Types](#data-types)
7. [Constraints](#constraints)
8. [Indexes](#indexes)
9. [Sample Queries](#sample-queries)

---

## Core Tables

### 1. Schools

**Purpose:** Top-level organizational unit. Represents major schools within the institution.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| name | character varying | NO | - | UNIQUE |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Example Data:**
- School of Science and Technology
- School of Engineering
- School of Business

**Relationships:**
- One-to-Many with `departments`

```sql
SELECT * FROM schools;
```

---

### 2. Departments

**Purpose:** Departments within schools. Organizational unit level 2.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| name | character varying | NO | - | UNIQUE |
| school_id | integer | NO | - | FOREIGN KEY → schools(id) |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Example Data:**
- Computer Science and Information Systems (School of Science and Technology)
- Information Technology (School of Science and Technology)
- Mechanical Engineering (School of Engineering)

**Relationships:**
- Many-to-One with `schools`
- One-to-Many with `programs`

```sql
SELECT d.name, s.name as school
FROM departments d
JOIN schools s ON d.school_id = s.id;
```

---

### 3. Programs

**Purpose:** Academic programs within departments. Organizational unit level 3.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| name | character varying | NO | - | UNIQUE |
| department_id | integer | NO | - | FOREIGN KEY → departments(id) |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Example Data:**
- Bachelor of Information Technology
- Diploma in IT
- Bachelor of Mechanical Engineering

**Relationships:**
- Many-to-One with `departments`
- One-to-Many with `courses`

```sql
SELECT p.name, d.name as department
FROM programs p
JOIN departments d ON p.department_id = d.id;
```

---

### 4. Courses

**Purpose:** Individual courses within programs. Organizational unit level 4.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| name | character varying | NO | - | - |
| code | character varying | NO | - | UNIQUE |
| program_id | integer | NO | - | FOREIGN KEY → programs(id) |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Example Data:**
- Course ID: 1, Code: CS101, Name: "Introduction to Programming", Program: Bachelor of IT
- Course ID: 2, Code: CS201, Name: "Data Structures", Program: Bachelor of IT

**Relationships:**
- Many-to-One with `programs`
- One-to-Many with `documents`

**Notes:**
- Course code must be unique across the system
- Course name can be duplicated (same course in different programs)

```sql
SELECT c.name, c.code, p.name as program
FROM courses c
JOIN programs p ON c.program_id = p.id
ORDER BY c.code;
```

---

### 5. Levels

**Purpose:** Academic levels (year/semester equivalents). Used to categorize documents.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| level_number | integer | NO | - | UNIQUE |
| description | character varying | YES | NULL | - |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Example Data:**
- Level 1 (Freshman)
- Level 2 (Sophomore)
- Level 3 (Junior)
- Level 4 (Senior)
- Level 5 (Graduate)

**Relationships:**
- One-to-Many with `documents`

```sql
SELECT * FROM levels ORDER BY level_number;
```

---

## Document Management

### 6. Documents

**Purpose:** Core table for managing all educational resources (past papers, journals, dissertations, course outlines, research papers).

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| title | character varying | NO | - | - |
| course_id | integer | NO | - | FOREIGN KEY → courses(id) |
| level_id | integer | YES | NULL | FOREIGN KEY → levels(id) |
| year | integer | YES | NULL | - |
| semester | integer | YES | NULL | - (1 or 2) |
| exam_type | character varying | YES | NULL | - |
| file_path | character varying | YES | NULL | - |
| file_key | character varying | YES | NULL | - |
| file_size | integer | YES | NULL | - |
| thumbnail_url | character varying | YES | NULL | - |
| thumbnail_key | character varying | YES | NULL | - |
| upload_status | character varying | NO | 'pending' | pending \| completed \| failed |
| uploaded_by | character varying | YES | NULL | FOREIGN KEY → users(username) |
| uploaded_at | timestamp without time zone | YES | NULL | - |
| error_message | text | YES | NULL | - |
| download_count | integer | NO | 0 | - |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Relationships:**
- Many-to-One with `courses`
- Many-to-One with `levels`
- One-to-Many with `download_logs`

**Field Descriptions:**

| Field | Purpose | Usage |
|-------|---------|-------|
| title | Document name | Display, search |
| course_id | Associated course | Required, hierarchical filter |
| level_id | Academic level | Optional, for level-based filtering |
| year | Publication/exam year | For past papers, journals |
| semester | Semester of exam | For past papers (1 or 2) |
| exam_type | Type of exam | "Mid-semester", "End-semester", etc. |
| file_path | Storage path | Internal reference |
| file_key | Cloud storage key | Blob storage identifier |
| file_size | Document size in bytes | Display, storage tracking |
| thumbnail_url | Preview image URL | Display in listings |
| thumbnail_key | Thumbnail in storage | Blob storage identifier |
| upload_status | Current upload state | Processing tracker |
| uploaded_by | Uploader username | Audit trail |
| error_message | Upload error details | Debugging |
| download_count | Total downloads | Analytics |

**Example Query:**
```sql
SELECT 
  d.id,
  d.title,
  c.code as course_code,
  p.name as program,
  d.year,
  d.exam_type,
  d.download_count
FROM documents d
JOIN courses c ON d.course_id = c.id
JOIN programs p ON c.program_id = p.id
WHERE d.upload_status = 'completed'
ORDER BY d.created_at DESC
LIMIT 10;
```

---

### 7. Download Logs

**Purpose:** Track document downloads for analytics and audit trails.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| document_id | integer | NO | - | FOREIGN KEY → documents(id) |
| user_id | character varying | NO | - | FOREIGN KEY → users(id) |
| downloaded_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Relationships:**
- Many-to-One with `documents`
- Many-to-One with `users`

**Use Cases:**
- Track which documents are most popular
- Monitor user activity
- Generate usage reports
- Compliance tracking

**Example Query:**
```sql
SELECT 
  d.title,
  COUNT(*) as total_downloads,
  COUNT(DISTINCT dl.user_id) as unique_users,
  MAX(dl.downloaded_at) as last_downloaded
FROM download_logs dl
JOIN documents d ON dl.document_id = d.id
GROUP BY d.id, d.title
ORDER BY total_downloads DESC;
```

---

## User Management

### 8. Users

**Purpose:** System users - admins and regular users. Authentication and authorization.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| username | character varying | NO | - | UNIQUE |
| email | character varying | NO | - | UNIQUE |
| role | character varying | NO | 'user' | 'admin' \| 'user' |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |

**Example Data:**
- ID: 1, Username: admin_user, Email: admin@university.edu, Role: admin
- ID: 2, Username: student_001, Email: student1@university.edu, Role: user

**Relationships:**
- One-to-Many with `sessions`
- One-to-Many with `download_logs`
- Referenced by `documents.uploaded_by`

**Access Levels:**
- **admin**: Can upload documents, manage resources, view analytics
- **user**: Can browse and download documents

```sql
SELECT * FROM users WHERE role = 'admin';
```

---

### 9. Sessions

**Purpose:** User session management for authentication and authorization.

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | integer | NO | auto_increment | PRIMARY KEY |
| user_id | character varying | NO | - | FOREIGN KEY → users(id) |
| token | character varying | NO | - | UNIQUE |
| created_at | timestamp without time zone | NO | CURRENT_TIMESTAMP | - |
| expires_at | timestamp without time zone | NO | - | - |

**Relationships:**
- Many-to-One with `users`

**Notes:**
- Tokens are unique per session
- Sessions expire based on `expires_at` timestamp
- Used for API authentication

```sql
SELECT s.*, u.username, u.email
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > NOW()
ORDER BY s.created_at DESC;
```

---

## Relationships

### Hierarchy Diagram

```
Schools (1)
    ├─→ Departments (N)
    │       ├─→ Programs (N)
    │       │   └─→ Courses (N)
    │       │       └─→ Documents (N)
    │       │           ├─→ Download_Logs (N)
    │       │           └─→ Levels (optional)
    │
Users (1)
    ├─→ Sessions (N)
    └─→ Download_Logs (N)
```

### Foreign Key Relationships

| From Table | To Table | Column | Purpose |
|-----------|----------|--------|---------|
| departments | schools | school_id | Organizational hierarchy |
| programs | departments | department_id | Organizational hierarchy |
| courses | programs | program_id | Organizational hierarchy |
| documents | courses | course_id | Resource categorization |
| documents | levels | level_id | Academic level tracking |
| download_logs | documents | document_id | Download tracking |
| download_logs | users | user_id | User tracking |
| sessions | users | user_id | Session management |

---

## Entity Relationship Diagram

```
┌─────────────┐
│   Schools   │
├─────────────┤
│ id (PK)     │
│ name        │
│ created_at  │
└──────┬──────┘
       │ 1:N
       │
    ┌──▼───────────────┐
    │  Departments     │
    ├──────────────────┤
    │ id (PK)          │
    │ name             │
    │ school_id (FK)   │
    │ created_at       │
    └──┬───────────────┘
       │ 1:N
       │
    ┌──▼──────────────┐
    │   Programs      │
    ├─────────────────┤
    │ id (PK)         │
    │ name            │
    │ department_id   │
    │   (FK)          │
    │ created_at      │
    └──┬──────────────┘
       │ 1:N
       │
    ┌──▼──────────────┐
    │   Courses       │
    ├─────────────────┤
    │ id (PK)         │
    │ name            │
    │ code            │
    │ program_id (FK) │
    │ created_at      │
    └──┬──────────────┘
       │ 1:N
       │
    ┌──▼─────────────────┐
    │   Documents         │
    ├─────────────────────┤
    │ id (PK)             │
    │ title               │
    │ course_id (FK)      │◄─────────┐
    │ level_id (FK)       │          │ 1:N
    │ year                │    ┌─────▼─────────┐
    │ semester            │    │    Levels     │
    │ exam_type           │    ├───────────────┤
    │ file_path           │    │ id (PK)       │
    │ file_key            │    │ level_number  │
    │ file_size           │    │ description   │
    │ upload_status       │    │ created_at    │
    │ uploaded_by         │    └───────────────┘
    │ created_at          │
    │ download_count      │
    └──┬────────────────┬─┘
       │ 1:N            │ 1:N
       │          ┌─────▼───────────────┐
    ┌──▼────────────────────┐  │ Download_Logs  │
    │      Users            │  ├────────────────┤
    ├───────────────────────┤  │ id (PK)        │
    │ id (PK)               │  │ document_id    │
    │ username              │  │   (FK)         │
    │ email                 │  │ user_id (FK)   │
    │ role                  │  │ downloaded_at  │
    │ created_at            │  └────────────────┘
    └──┬─────────────────────┘
       │ 1:N
       │
    ┌──▼────────────────┐
    │    Sessions       │
    ├───────────────────┤
    │ id (PK)           │
    │ user_id (FK)      │
    │ token             │
    │ created_at        │
    │ expires_at        │
    └───────────────────┘
```

---

## Data Types

### PostgreSQL Data Types Used

| Type | Usage | Examples |
|------|-------|----------|
| integer | IDs, counts, numbers | id, download_count, year |
| character varying | Text strings | name, title, code, email |
| text | Long text content | error_message, description |
| timestamp without time zone | Date/time tracking | created_at, uploaded_at, expires_at |

### Type Specifications

- **ID Fields**: `integer` with auto-increment
- **Names/Codes**: `character varying` (unlimited length)
- **Error Messages**: `text` (for longer content)
- **Timestamps**: `timestamp without time zone` with UTC assumed
- **Counts**: `integer` starting at 0

---

## Constraints

### Primary Keys (PK)

All tables have an `id` column as PRIMARY KEY with auto-increment:
- schools.id
- departments.id
- programs.id
- courses.id
- levels.id
- documents.id
- download_logs.id
- users.id
- sessions.id

### Unique Constraints

| Table | Columns | Purpose |
|-------|---------|---------|
| schools | name | Prevent duplicate schools |
| departments | name | Prevent duplicate department names |
| programs | name | Prevent duplicate program names |
| courses | code | Enforce unique course codes |
| levels | level_number | Enforce unique level numbers |
| users | username | Prevent duplicate usernames |
| users | email | Prevent duplicate emails |
| sessions | token | Enforce unique session tokens |

### Foreign Key Constraints

All foreign key relationships include:
- `ON DELETE CASCADE` (when parent deleted, cascade to children)
- `ON UPDATE CASCADE` (when parent updated, update in children)

---

## Indexes

### Automatically Created Indexes

PostgreSQL automatically creates indexes for:
- Primary Keys (all `id` columns)
- Foreign Keys (referenced in queries)

### Recommended Additional Indexes

Consider adding for better query performance:

```sql
-- For document lookups by course
CREATE INDEX idx_documents_course_id ON documents(course_id);

-- For document status queries
CREATE INDEX idx_documents_upload_status ON documents(upload_status);

-- For download tracking queries
CREATE INDEX idx_download_logs_document_id ON download_logs(document_id);
CREATE INDEX idx_download_logs_user_id ON download_logs(user_id);
CREATE INDEX idx_download_logs_downloaded_at ON download_logs(downloaded_at);

-- For session lookups
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- For searches
CREATE INDEX idx_courses_code ON courses(code);
```

---

## Sample Queries

### 1. Browse Documents by Course

```sql
SELECT 
  d.id,
  d.title,
  c.code,
  d.year,
  d.semester,
  d.exam_type,
  d.download_count
FROM documents d
JOIN courses c ON d.course_id = c.id
WHERE c.id = ? AND d.upload_status = 'completed'
ORDER BY d.year DESC, d.semester DESC;
```

### 2. Get All Documents in a Program

```sql
SELECT 
  d.id,
  d.title,
  c.name as course_name,
  d.year,
  d.download_count
FROM documents d
JOIN courses c ON d.course_id = c.id
WHERE c.program_id = ? AND d.upload_status = 'completed'
ORDER BY d.created_at DESC;
```

### 3. Get Department Hierarchy

```sql
SELECT 
  s.name as school,
  d.name as department,
  p.name as program,
  COUNT(c.id) as course_count
FROM schools s
LEFT JOIN departments d ON s.id = d.school_id
LEFT JOIN programs p ON d.id = p.department_id
LEFT JOIN courses c ON p.id = c.program_id
GROUP BY s.id, s.name, d.id, d.name, p.id, p.name
ORDER BY s.name, d.name, p.name;
```

### 4. Most Downloaded Documents

```sql
SELECT 
  d.id,
  d.title,
  c.code,
  d.download_count,
  COUNT(dl.id) as recent_downloads
FROM documents d
JOIN courses c ON d.course_id = c.id
LEFT JOIN download_logs dl ON d.id = dl.document_id 
  AND dl.downloaded_at > NOW() - INTERVAL '30 days'
WHERE d.upload_status = 'completed'
GROUP BY d.id, d.title, c.code, d.download_count
ORDER BY d.download_count DESC
LIMIT 10;
```

### 5. User Activity Report

```sql
SELECT 
  u.username,
  u.email,
  COUNT(DISTINCT dl.document_id) as documents_downloaded,
  COUNT(dl.id) as total_downloads,
  MAX(dl.downloaded_at) as last_download
FROM users u
LEFT JOIN download_logs dl ON u.id = dl.user_id
GROUP BY u.id, u.username, u.email
ORDER BY total_downloads DESC;
```

### 6. Pending Uploads

```sql
SELECT 
  d.id,
  d.title,
  c.code,
  d.upload_status,
  d.error_message,
  d.uploaded_by,
  d.created_at
FROM documents d
JOIN courses c ON d.course_id = c.id
WHERE d.upload_status IN ('pending', 'failed')
ORDER BY d.created_at ASC;
```

### 7. Active Sessions

```sql
SELECT 
  u.id,
  u.username,
  u.email,
  u.role,
  s.created_at as login_time,
  s.expires_at
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > NOW()
ORDER BY s.created_at DESC;
```

### 8. Content by Academic Level

```sql
SELECT 
  l.level_number,
  l.description,
  COUNT(d.id) as document_count,
  AVG(d.download_count) as avg_downloads
FROM levels l
LEFT JOIN documents d ON l.id = d.level_id
WHERE d.upload_status = 'completed'
GROUP BY l.id, l.level_number, l.description
ORDER BY l.level_number;
```

---

## Data Entry Standards

### Field Validation

| Field | Format | Example |
|-------|--------|---------|
| school.name | Title case, 50-200 chars | "School of Engineering" |
| department.name | Title case, 50-150 chars | "Computer Science" |
| program.name | Title case, 30-150 chars | "Bachelor of Information Technology" |
| course.code | Uppercase, 2-10 chars | "CS101", "ENG201" |
| course.name | Title case, 30-150 chars | "Introduction to Programming" |
| document.title | Sentence case, 10-200 chars | "CS101 Final Exam 2024" |
| user.username | Lowercase, 3-30 chars, alphanumeric | "john_doe_01", "admin_user" |
| user.email | Valid email format | "user@university.edu" |

### Value Ranges

| Field | Min | Max | Constraints |
|-------|-----|-----|-------------|
| level.level_number | 1 | 5 | Integer |
| document.year | 2000 | 2100 | Integer |
| document.semester | 1 | 2 | Integer (or NULL) |
| document.download_count | 0 | ∞ | Non-negative integer |
| sessions.expires_at | NOW() | NOW() + 30 days | Future timestamp |

---

## Backup & Recovery

### Backup Strategy

- **Frequency**: Daily automatic backups via Neon
- **Retention**: 7 days (configurable)
- **Recovery Point Objective (RPO)**: 1 day
- **Recovery Time Objective (RTO)**: < 1 hour

### Backup Verification

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Performance Optimization

### Query Performance Tips

1. **Always filter by course_id** - Most queries start with course hierarchy
2. **Use indexes on foreign keys** - Improves JOIN performance
3. **Limit result sets** - Use LIMIT/OFFSET for pagination
4. **Avoid SELECT *** - Select only needed columns
5. **Use appropriate data types** - Reduces storage and improves speed

### Common Query Patterns

```sql
-- Efficient: With indexes
SELECT * FROM documents 
WHERE course_id = ? AND upload_status = 'completed'
ORDER BY year DESC LIMIT 20;

-- Inefficient: No index on title
SELECT * FROM documents 
WHERE title LIKE '%keyword%'
ORDER BY year DESC;
```

---

## Migration Guide

### Adding a New Column

1. Assess impact on existing code
2. Add column with default value or nullable
3. Update API/application code
4. Test thoroughly
5. Update this documentation

Example:
```sql
ALTER TABLE documents 
ADD COLUMN resource_type VARCHAR(50) DEFAULT 'document';
```

### Adding a New Table

1. Design schema thoroughly
2. Create table with appropriate constraints
3. Add foreign keys if needed
4. Create indexes for performance
5. Document in this file
6. Update ER diagram

---

## Security Considerations

### Data Protection

- All sensitive data (passwords, tokens) hashed before storage
- Sessions expire after inactivity
- No plaintext passwords in logs
- User emails treated as sensitive PII

### Access Control

- **Admin Only**: Manage users, upload documents, delete content
- **Users**: View documents, download, track personal activity
- **Session-based**: All API calls require valid session token

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-06-07 | 1.0 | Initial schema documentation |

---

## Related Documentation

- [System Description](./SYSTEM_DESCRIPTION.md) - System overview
- [Architecture](./ARCHITECTURE.md) - System architecture
- [API Reference](./SYSTEM_DESCRIPTION.md#api-endpoints) - API endpoints
- [Deployment Guide](./SYSTEM_DESCRIPTION.md#deployment) - Deployment info

---

**Database Schema v1.0**  
*Comprehensive reference for MUBAS Digital Library database*

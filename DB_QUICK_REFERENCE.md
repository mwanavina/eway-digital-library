# Database Quick Reference - MUBAS Digital Library

Quick lookup for common database operations, queries, and table information.

## Table Summary

| Table | Rows* | Purpose | Key Field |
|-------|-------|---------|-----------|
| schools | 3 | Institution schools | name (unique) |
| departments | 5 | School departments | name (unique) |
| programs | 5 | Department programs | name (unique) |
| courses | 20+ | Program courses | code (unique) |
| levels | 5 | Academic levels 1-5 | level_number |
| documents | 100+ | Educational resources | id, course_id |
| users | 2+ | System users | username, email |
| sessions | - | Active sessions | token (unique) |
| download_logs | - | Download history | document_id, user_id |

*Approximate counts from seed data

## Hierarchy Visualization

```
Schools (Top)
  ├─ Departments
  │   ├─ Programs
  │   │   └─ Courses
  │   │       └─ Documents
  │   └─ Levels (optional for docs)
  └─ Users
      ├─ Sessions
      └─ Download_Logs
```

## Column Quick Lookup

### Schools Table
```
id (int)           - Primary key
name (varchar)     - School name (unique)
created_at         - Creation timestamp
```

### Departments Table
```
id (int)           - Primary key
name (varchar)     - Department name (unique)
school_id (int)    - Foreign key to schools
created_at         - Creation timestamp
```

### Programs Table
```
id (int)           - Primary key
name (varchar)     - Program name (unique)
department_id (int)- Foreign key to departments
created_at         - Creation timestamp
```

### Courses Table
```
id (int)           - Primary key
name (varchar)     - Course name
code (varchar)     - Course code (unique)
program_id (int)   - Foreign key to programs
created_at         - Creation timestamp
```

### Levels Table
```
id (int)           - Primary key
level_number (int) - 1-5 (unique)
description (varchar) - "Level 1", "Level 2", etc.
created_at         - Creation timestamp
```

### Documents Table
```
id (int)           - Primary key
title (varchar)    - Document title
course_id (int)    - Foreign key to courses (required)
level_id (int)     - Foreign key to levels (optional)
year (int)         - Publication/exam year
semester (int)     - 1 or 2 (optional)
exam_type (varchar)- "Mid-semester", "End-semester"
file_path (varchar)- Storage path
file_key (varchar) - Blob storage key
file_size (int)    - Size in bytes
thumbnail_url      - Preview image URL
upload_status      - pending | completed | failed
uploaded_by        - Uploader username
uploaded_at        - Upload completion time
error_message      - Upload error details
download_count     - Total downloads
created_at         - Creation timestamp
```

### Users Table
```
id (int)           - Primary key
username (varchar) - Username (unique)
email (varchar)    - Email (unique)
role (varchar)     - admin | user
created_at         - Creation timestamp
```

### Sessions Table
```
id (int)           - Primary key
user_id (int)      - Foreign key to users
token (varchar)    - Unique session token
created_at         - Creation timestamp
expires_at         - Session expiration time
```

### Download_Logs Table
```
id (int)           - Primary key
document_id (int)  - Foreign key to documents
user_id (int)      - Foreign key to users
downloaded_at      - Download timestamp
```

## Common Queries

### Get All Documents for a Course
```sql
SELECT d.* FROM documents d
WHERE d.course_id = ? AND d.upload_status = 'completed'
ORDER BY d.year DESC;
```

### Get Full Hierarchy Path
```sql
SELECT s.name as school, d.name as department, 
       p.name as program, c.name as course
FROM courses c
JOIN programs p ON c.program_id = p.id
JOIN departments d ON p.department_id = d.id
JOIN schools s ON d.school_id = s.id
WHERE c.id = ?;
```

### Get Most Downloaded Documents
```sql
SELECT d.id, d.title, d.download_count
FROM documents d
WHERE d.upload_status = 'completed'
ORDER BY d.download_count DESC
LIMIT 10;
```

### Get User Downloads
```sql
SELECT d.title, dl.downloaded_at
FROM download_logs dl
JOIN documents d ON dl.document_id = d.id
WHERE dl.user_id = ?
ORDER BY dl.downloaded_at DESC;
```

### Get Pending Uploads
```sql
SELECT d.id, d.title, d.upload_status, d.error_message
FROM documents d
WHERE d.upload_status IN ('pending', 'failed')
ORDER BY d.created_at ASC;
```

## Data Formats

### Upload Status Values
- `pending` - Upload in progress
- `completed` - Upload successful
- `failed` - Upload failed

### User Roles
- `admin` - Can upload, manage resources
- `user` - Can browse, download

### Semester Values
- `1` - First semester
- `2` - Second semester
- `NULL` - Not applicable

### Academic Levels
- `1` - Year 1 / Freshman
- `2` - Year 2 / Sophomore
- `3` - Year 3 / Junior
- `4` - Year 4 / Senior
- `5` - Graduate / Postgraduate

## Database Statistics

### Current Data (Seed Data)
- Schools: 3
- Departments: 5
- Programs: 5
- Courses: 20+
- Levels: 5 (fixed)
- Documents: 100+
- Users: 2+ (admin + test)
- Sessions: Variable
- Downloads: 0+ (accumulated)

### Database Size Estimation
- Current: ~5-10 MB
- Per 1000 documents: +1-2 MB
- Per 10000 downloads: +0.5-1 MB

## Performance Notes

### Most Common Queries
1. **Get documents by course** (filters, browse page)
2. **Get hierarchy** (navigation, structure)
3. **Get downloads** (analytics)
4. **Get user sessions** (authentication)

### Optimization Tips
- Always filter by course_id when possible
- Use indexes on foreign keys
- Limit results with OFFSET/LIMIT
- Cache frequently accessed data
- Use EXPLAIN ANALYZE for slow queries

## Connection Details

### From Node.js
```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const result = await sql`SELECT * FROM documents LIMIT 10`;
```

### Connection String Format
```
postgresql://user:password@host:5432/database
```

### Environment Variable
```
DATABASE_URL=postgresql://...
```

## Development Tips

### Reset Seed Data
Run seed script to repopulate test data:
```bash
node scripts/seed-data.js
```

### Test Connection
```javascript
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const result = await sql`SELECT 1 as test`;
console.log(result);
```

### Check Table Status
```sql
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public';
```

## Constraints Reference

### Unique Constraints
- schools.name
- departments.name
- programs.name
- courses.code
- levels.level_number
- users.username
- users.email
- sessions.token

### Foreign Key Constraints
- departments.school_id → schools.id
- programs.department_id → departments.id
- courses.program_id → programs.id
- documents.course_id → courses.id
- documents.level_id → levels.id
- download_logs.document_id → documents.id
- download_logs.user_id → users.id
- sessions.user_id → users.id

### Check Constraints
- semester IN (1, 2) or NULL
- upload_status IN ('pending', 'completed', 'failed')
- role IN ('admin', 'user')
- level_number >= 1 AND level_number <= 10

## Troubleshooting

### Connection Issues
- Check DATABASE_URL is set
- Verify Neon project is active
- Check firewall/IP whitelist

### Duplicate Key Errors
- schools.name, departments.name, programs.name must be unique
- courses.code must be unique
- users.username, users.email must be unique

### Slow Queries
- Check if indexes exist
- Use EXPLAIN ANALYZE
- Avoid SELECT * (select specific columns)
- Filter early (WHERE clause)

### Data Not Appearing
- Check upload_status = 'completed'
- Verify course_id is correct
- Check timestamps (created_at)

## Related Files

- **DATABASE_SCHEMA.md** - Complete schema documentation
- **schema.sql** - SQL schema definition file
- **SYSTEM_DESCRIPTION.md** - System overview
- **ARCHITECTURE.md** - Architecture guide
- **scripts/seed-data.js** - Test data seeding

## Last Updated

2026-06-07 - v1.0

---

**Quick Reference for Database Operations**
*For detailed information, see DATABASE_SCHEMA.md*

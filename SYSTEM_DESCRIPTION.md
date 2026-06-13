# MUBAS Digital Library - Complete System Description

## Project Overview

**MUBAS Digital Library** is a comprehensive academic resource management and discovery platform designed for universities and educational institutions. The system enables students and faculty to browse, search, and download multiple types of academic materials including past examination papers, journals, dissertations, course outlines, and research papers.

**Version**: 0.1.0  
**Framework**: Next.js 16.2.0 with React 19.2.4  
**Database**: PostgreSQL (Neon Serverless)  
**Deployment**: Vercel  

---

## System Architecture

### 1. Technology Stack

#### Frontend
- **Framework**: Next.js 16.2.0 (App Router)
- **UI Library**: React 19.2.4 with Server Components
- **Component Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 4.2.0
- **PDF Rendering**: react-pdf, pdfjs-dist
- **File Upload**: Uploadthing
- **Icons**: lucide-react
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Hooks (useState, useCallback, useEffect)
- **UI Features**: Sonner (toast notifications), Vaul (drawer), embla-carousel

#### Backend
- **Runtime**: Node.js (Vercel Serverless)
- **Database Driver**: @neondatabase/serverless (Neon PostgreSQL)
- **Server Actions**: Next.js App Router Server Actions
- **API Routes**: Next.js Route Handlers (TypeScript)
- **Image Processing**: Sharp (PDF thumbnail generation)
- **PDF Processing**: pdf-parse

#### Database
- **Type**: PostgreSQL (Neon Serverless)
- **ORM**: Raw SQL queries via Neon serverless driver
- **Connection**: Serverless HTTP driver for edge compatibility

---

## Database Schema

### Core Tables (9 Total)

#### 1. **Schools**
Represents academic institutions
```sql
- id (PRIMARY KEY)
- name (VARCHAR)
- description (TEXT, optional)
- created_at (TIMESTAMP)
```

#### 2. **Departments**
Academic departments within schools
```sql
- id (PRIMARY KEY)
- name (VARCHAR)
- school_id (FOREIGN KEY → schools.id)
- description (TEXT, optional)
- created_at (TIMESTAMP)
```

#### 3. **Programs**
Degree programs within departments
```sql
- id (PRIMARY KEY)
- name (VARCHAR)
- code (VARCHAR)
- department_id (FOREIGN KEY → departments.id)
- description (TEXT, optional)
- created_at (TIMESTAMP)
```

#### 4. **Courses**
Individual courses within programs
```sql
- id (PRIMARY KEY)
- name (VARCHAR)
- code (VARCHAR)
- program_id (FOREIGN KEY → programs.id)
- description (TEXT, optional)
- created_at (TIMESTAMP)
```

#### 5. **Levels**
Academic levels (Year 1, Year 2, etc.)
```sql
- id (PRIMARY KEY)
- name (VARCHAR)
- description (TEXT, optional)
- created_at (TIMESTAMP)
```

#### 6. **Documents** (Main table)
Academic resources with polymorphic support
```sql
- id (PRIMARY KEY)
- title (VARCHAR)
- course_id (FOREIGN KEY → courses.id)
- resource_type_id (FOREIGN KEY → resource_types.id)
- year (INTEGER, optional - for past papers)
- semester (INTEGER, optional - for past papers)
- exam_type (VARCHAR, optional - for past papers)
- author (VARCHAR, optional - for journals, dissertations)
- publication_date (DATE, optional - for journals)
- abstract (TEXT, optional - for journals, dissertations)
- doi (VARCHAR, optional - for research papers)
- keywords (TEXT, optional - searchable metadata)
- file_path (VARCHAR - URL to stored file)
- file_key (VARCHAR - Uploadthing file key)
- thumbnail_url (VARCHAR, optional)
- thumbnail_key (VARCHAR, optional - Uploadthing key)
- upload_status (VARCHAR - 'pending', 'processing', 'completed', 'failed')
- download_count (INTEGER, default 0)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 7. **Resource Types**
Metadata about different resource categories
```sql
- id (PRIMARY KEY)
- name (VARCHAR UNIQUE - 'Past Papers', 'Journals', 'Dissertations', etc.)
- description (TEXT)
- icon (VARCHAR - icon name for UI)
- color (VARCHAR - hex color for UI badges)
- created_at (TIMESTAMP)
```

**Seeded Values:**
1. Past Papers (#1782C5 blue)
2. Journals (#1F2557 dark blue)
3. Dissertations (#8B5A8F purple)
4. Course Outlines (#F59E0B amber)
5. Research Papers (#10B981 teal)

#### 8. **Download Logs**
Tracks document downloads for analytics
```sql
- id (PRIMARY KEY)
- document_id (FOREIGN KEY → documents.id)
- user_id (FOREIGN KEY → users.id, optional)
- ip_address (VARCHAR)
- user_agent (VARCHAR)
- downloaded_at (TIMESTAMP)
```

#### 9. **Users**
User accounts for future auth integration
```sql
- id (PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR)
- role (VARCHAR - 'user', 'admin', 'moderator')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 10. **Sessions** (Auth)
Session management for authentication
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- token (VARCHAR UNIQUE)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

---

## Application Structure

### Directory Layout
```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx                          # Root layout with metadata
│   ├── page.tsx                            # Main browse/search page
│   ├── admin/
│   │   └── page.tsx                        # Admin dashboard
│   ├── api/
│   │   ├── documents/
│   │   │   ├── route.ts                    # GET/POST documents with filtering
│   │   │   ├── process-thumbnail/route.ts  # PDF thumbnail generation
│   │   │   └── track-download/route.ts     # Download tracking
│   │   ├── filters/
│   │   │   └── route.ts                    # Get schools, departments, programs, courses
│   │   └── uploadthing/
│   │       └── route.ts                    # File upload handler
│   └── actions/
│       ├── admin.ts                        # Server actions for CRUD operations
│       ├── documents.ts                    # Document creation & management
│       └── download.ts                     # Download tracking
├── components/
│   ├── header.tsx                          # Navigation header with search
│   ├── document-card.tsx                   # Card for displaying documents
│   ├── resource-card.tsx                   # Enhanced card with type-specific metadata
│   ├── pdf-modal.tsx                       # Modal for PDF viewing
│   ├── pdf-preview.tsx                     # PDF preview component
│   ├── filter-sidebar.tsx                  # Legacy filter sidebar
│   ├── admin/
│   │   ├── upload-form.tsx                 # Basic upload form
│   │   ├── upload-form-enhanced.tsx        # Multi-type upload with conditional fields
│   │   ├── admin-table.tsx                 # Table for CRUD operations
│   │   ├── admin-modal.tsx                 # Modal for creating/editing items
│   │   ├── document-list.tsx               # Display uploaded documents
│   │   └── confirm-dialog.tsx              # Delete confirmation
│   ├── filters/
│   │   ├── all-resources-filter.tsx        # Filter for all resources (school/dept/program/course)
│   │   ├── past-papers-filter.tsx          # Past papers specific (+ year, semester, exam type)
│   │   ├── journals-filter.tsx             # Journals filter (academic area)
│   │   ├── dissertations-filter.tsx        # Dissertations filter
│   │   └── course-outlines-filter.tsx      # Course outlines filter
│   └── ui/
│       ├── button.tsx, card.tsx, etc.      # 40+ shadcn/ui components
│       └── spinner.tsx, empty.tsx          # Custom components
├── scripts/
│   ├── migrate-add-resource-types.js       # Migration: create resource_types table
│   └── seed-resource-types.js              # Seed resource types data
└── public/
    ├── icon.svg                            # Favicon
    └── apple-icon.png                      # Apple touch icon
```

---

## Key Features

### 1. Multi-Resource Type Support

The system supports 5 different types of academic materials:

| Resource Type | Fields | Use Case |
|---------------|--------|----------|
| **Past Papers** | Year, Semester, Exam Type | Exam preparation |
| **Journals** | Author, Publication Date, Abstract | Academic research |
| **Dissertations** | Student Name, Year, Abstract | Student research |
| **Course Outlines** | Course, Level, Term | Curriculum planning |
| **Research Papers** | Author, DOI, Keywords, Abstract | Research discovery |

### 2. Browse & Discovery

**Resource Type Tabs** (6 tabs on main page)
- All Resources (default)
- Past Papers
- Journals
- Dissertations
- Course Outlines
- Research Papers

Each tab shows color-coded cards with type-specific metadata.

**Hierarchical Filtering**
```
School → Department → Program → Course
```
- Dynamic filter options based on selections
- Type-specific filters (Year/Semester for Past Papers, etc.)
- Clear filters button

**Search**
- Global search across all resource types
- Searches in: title, abstract, keywords, author names

### 3. Admin Dashboard

**Upload Management**
- Enhanced form with resource type dropdown
- Conditional field rendering based on selected type
- File upload via Uploadthing
- Automatic PDF thumbnail generation
- Upload status tracking (pending → processing → completed)

**Content Management**
- CRUD operations for Schools, Departments, Programs, Courses, Levels
- Admin table interface with modal for create/edit
- Delete confirmation dialog
- Tabbed interface for organization

**Document Management**
- View all uploaded documents
- Delete documents with cleanup
- Download count tracking
- Resource type display

### 4. File Management

**Upload Processing**
1. User selects file in admin form
2. File uploaded to Uploadthing
3. Document saved to database with 'pending' status
4. Thumbnail generation triggered asynchronously
5. Status updated to 'completed' after processing

**Thumbnail Generation**
- Extracts first page of PDF
- Converts to JPEG using Sharp
- Stored via Uploadthing
- Used for visual preview in cards

**Download Tracking**
- Records IP address, user agent, timestamp
- Increments download_count on documents
- API endpoint for tracking

---

## User Flows

### 1. Student/Faculty User Journey

```
1. Visit homepage (/)
2. See "All Resources" tab with available materials
3. Click resource type tab (e.g., "Past Papers")
4. Sidebar shows type-specific filters
5. Select School → Department → Program → Course
6. Browse results with document cards
7. Click card to view PDF in modal
8. Download PDF
   - Opens new tab/downloads file
   - Download tracked in database
   - Download count incremented
```

### 2. Admin User Journey

```
1. Navigate to /admin
2. Click "Upload" tab
3. Select Resource Type
4. Fill type-specific fields:
   - Title (required)
   - School, Department, Program, Course
   - Type-specific metadata (author, year, abstract, etc.)
5. Upload PDF file
6. Wait for thumbnail generation
7. View in "Documents" tab

Separate tabs for managing:
- Schools
- Departments
- Programs
- Courses
- Levels
- Documents
```

---

## API Endpoints

### GET /api/documents
Fetch documents with optional filtering

**Query Parameters:**
```
- schoolId: Filter by school
- departmentId: Filter by department
- courseId: Filter by course
- resourceType: Filter by resource type (e.g., "Past Papers")
- year: Filter by year (for past papers)
- semester: Filter by semester
- examType: Filter by exam type
- search: Full-text search query
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Calculus I Midterm 2024",
      "course_name": "Calculus I",
      "course_code": "MATH101",
      "school_name": "School of Science",
      "department_name": "Mathematics",
      "resource_type_name": "Past Papers",
      "year": 2024,
      "semester": 1,
      "exam_type": "Mid-semester",
      "file_path": "https://...",
      "thumbnail_url": "https://...",
      "download_count": 145,
      "author": null,
      "publication_date": null,
      "abstract": null
    }
  ]
}
```

### GET /api/filters
Get available filter options

**Response:**
```json
{
  "success": true,
  "schools": [
    {"id": 1, "name": "School of Science"},
    {"id": 2, "name": "School of Engineering"}
  ],
  "departments": [
    {"id": 1, "name": "Mathematics", "school_id": 1}
  ],
  "programs": [
    {"id": 1, "name": "BSc Mathematics", "department_id": 1}
  ],
  "courses": [
    {"id": 1, "name": "Calculus I", "code": "MATH101", "program_id": 1}
  ]
}
```

### POST /api/documents
Create new document (called from admin form)

**Body:**
```json
{
  "title": "Physics Exam 2024",
  "courseId": 5,
  "resourceTypeId": 1,
  "year": 2024,
  "semester": 2,
  "examType": "End-semester",
  "fileKey": "uploadthing_file_key",
  "fileUrl": "https://uploadthing.com/...",
  "author": null,
  "publicationDate": null,
  "abstract": null
}
```

### POST /api/documents/track-download
Record document download

**Body:**
```json
{
  "documentId": 1
}
```

### POST /api/documents/process-thumbnail
Generate PDF thumbnail asynchronously

**Body:**
```json
{
  "documentId": 1,
  "fileUrl": "https://uploadthing.com/...",
  "fileKey": "uploadthing_file_key"
}
```

---

## Component Architecture

### Page Components

**app/page.tsx** (Browse/Search Page)
- Manages document state, filters, search
- Renders resource type tabs
- Conditionally renders resource-specific filter sidebars
- Displays document grid with ResourceCard components
- Responsive layout with mobile sidebar toggle

**app/admin/page.tsx** (Admin Dashboard)
- Tabbed interface (upload, schools, departments, programs, courses, levels, documents)
- Modal for CRUD operations
- Enhanced upload form with type-specific fields
- Document list with delete functionality
- Admin table components for all entities

### Feature Components

**ResourceCard** (components/resource-card.tsx)
Enhanced document card showing type-specific metadata:
- Displays resource type badge with color
- Shows type-specific fields (author, year, abstract, etc.)
- Download count indicator
- PDF preview on click
- Download button with tracking

**AllResourcesFilter** (components/filters/all-resources-filter.tsx)
Filter sidebar for "All Resources" tab
- School → Department → Program → Course hierarchy
- Shows count of available options
- Radio button selections
- Clear all filters button

**PastPapersFilter** (components/filters/past-papers-filter.tsx)
Specialized filter for Past Papers
- Course hierarchy (like all others)
- Year dropdown (2024, 2023, 2022, 2021, 2020)
- Semester dropdown (1 or 2)
- Exam Type dropdown (Mid-semester, End-semester)

**JournalsFilter** (components/filters/journals-filter.tsx)
Filter for Journals & Research Papers
- Course hierarchy only (academic area focused)
- Simplified for journal discovery

**DissertationsFilter** (components/filters/dissertations-filter.tsx)
Filter for dissertations
- Course hierarchy
- Focused on research departments

**CourseOutlinesFilter** (components/filters/course-outlines-filter.tsx)
Filter for course syllabi
- Course hierarchy
- Curriculum-focused organization

**AdminUploadFormEnhanced** (components/admin/upload-form-enhanced.tsx)
Multi-type upload form
- Resource type selector at top
- Conditional field rendering based on type
- Common fields: Title, File, School, Department, Program, Course
- Type-specific fields: Author, Publication Date, Abstract, Year, Semester, Exam Type
- Form validation and error handling
- Upload progress indicator

---

## State Management

### React Hooks Pattern

**Browse Page State:**
```typescript
- documents: Document[] // Fetched documents
- loading: boolean // API call status
- searchQuery: string // Search input
- activeResourceType: ResourceType // Selected tab
- schools, departments, programs, courses: any[] // Filter options
- filters: { schoolId, departmentId, ..., examType } // Applied filters
- sidebarOpen: boolean // Mobile sidebar toggle
```

**Admin Page State:**
```typescript
- activeTab: Tab // Current admin section
- schools, departments, programs, courses, levels, documents, resourceTypes: any[]
- isModalOpen: boolean // CRUD modal visibility
- confirmDelete: any // Delete confirmation
- editingItem: any // Item being edited
- formData: FormData // Form input values
- loading: boolean // Operation status
```

### Data Fetching

**useCallback + useEffect Pattern:**
```typescript
const fetchDocuments = useCallback(async () => {
  // Build query parameters
  // Fetch from /api/documents
  // Update documents state
}, [filters, searchQuery, activeResourceType])

useEffect(() => {
  // Debounced fetch on filter change
  const timer = setTimeout(() => fetchDocuments(), 300)
  return () => clearTimeout(timer)
}, [filters, searchQuery, fetchDocuments, activeResourceType])
```

---

## Security & Validation

### Input Validation

**Server Actions (documents.ts, admin.ts):**
- SQL injection prevention via parameterized queries (Neon)
- Type checking with TypeScript interfaces
- Required field validation before DB operations

**Upload Form (upload-form-enhanced.tsx):**
- Client-side validation with React Hook Form + Zod
- File type checking (PDF only)
- File size limits via Uploadthing
- Required field validation

### Access Control

**Current State:**
- No authentication implemented yet
- Admin routes publicly accessible
- Download tracking records but not user-based

**Future:**
- JWT/Session-based authentication
- Role-based access control (user, admin, moderator)
- Protected admin routes
- Per-user download history

---

## Performance Optimizations

### Image Handling
- Sharp for server-side image processing
- PDF thumbnails stored as JPEG
- Uploadthing CDN for file delivery

### Database
- Indexed queries on commonly filtered columns
- Limit 100-200 documents per fetch
- Efficient JOIN queries

### Frontend
- Next.js Server Components for layout
- Client Components only where needed
- Lazy loading of PDF viewer modal
- Responsive image loading

---

## Environment Configuration

### Required Environment Variables
```
DATABASE_URL=postgresql://user:password@host/db
UPLOADTHING_TOKEN=your_uploadthing_token
```

### Optional
```
NODE_ENV=production
```

---

## Deployment

**Platform:** Vercel  
**Build Command:** `next build`  
**Start Command:** `next start`  
**Database:** Neon Serverless PostgreSQL  

**Deployment Flow:**
1. Push to GitHub
2. Vercel auto-deploys
3. Database migrations run (manual or via scripts)
4. Build succeeds with Next.js 16

---

## Future Extensions

### Phase 1 (Current)
- Multi-resource type support
- Resource-specific filters
- Basic upload and discovery

### Phase 2
- User authentication and accounts
- Advanced search with facets
- Download history per user
- Recommendations engine

### Phase 3
- Collections/Reading lists
- Citation export (APA, MLA, Harvard)
- Resource versioning
- Comments and ratings
- Full-text search in document content

### Phase 4
- Analytics dashboard
- Content moderation tools
- API for external integrations
- Mobile app

---

## Troubleshooting

### No Data Appearing
1. Check DATABASE_URL is set correctly
2. Verify database migrations ran
3. Confirm documents exist in database
4. Check browser console for API errors

### Images/Thumbnails Not Loading
1. Verify UPLOADTHING_TOKEN is set
2. Check file permissions
3. Ensure Sharp is installed
4. Review API logs for processing errors

### Upload Fails
1. Verify file is valid PDF
2. Check file size (must be < limit)
3. Ensure course/department/program selected
4. Review upload status in admin documents tab

---

## Developer Notes

### Adding New Resource Types

1. Add to resource_types table via migration
2. Update RESOURCE_TYPES constant in page.tsx
3. Add new filter component in components/filters/
4. Import in page.tsx and add to filter rendering
5. Add type-specific field to upload form

### Modifying Filter Sidebar

1. Edit filter component in components/filters/
2. Update FilterSection parameters
3. Test on mobile and desktop
4. Verify filter options populate correctly

### Database Changes

1. Create migration script in scripts/
2. Test locally with Neon
3. Run via SystemAction in v0
4. Verify data integrity
5. Update any related queries

---

**System Last Updated:** 2026-06-03  
**Created By:** v0 AI Assistant  
**Status:** Active Development

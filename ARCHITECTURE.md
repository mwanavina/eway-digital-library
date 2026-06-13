# MUBAS Digital Library - System Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React 19 + Next.js 16)                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  ┌─────────────────────────┐  ┌──────────────────┐  ┌─────────────────────┐    │
│  │   app/page.tsx          │  │  app/admin/page  │  │  app/layout.tsx     │    │
│  │  (Browse/Search)        │  │  (Admin Panel)   │  │  (Root Layout)      │    │
│  └──────────┬──────────────┘  └────────┬─────────┘  └─────────────────────┘    │
│             │                          │                                         │
│             ├─────────────┬────────────┴──────────────┬─────────────────────┐   │
│             │             │                          │                     │   │
│      ┌──────▼────┐ ┌──────▼──────┐ ┌───────▼──────┐ ┌▼──────┐ ┌──────────▼─┐ │
│      │ResourceCard│ │AllResources │ │PastPapers   │ │Upload │ │AdminTable  │ │
│      │Component   │ │Filter       │ │Filter       │ │Form   │ │Components  │ │
│      └────────────┘ └─────────────┘ └─────────────┘ └───────┘ └────────────┘ │
│                                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  Component Library (40+ shadcn/ui Components)                            │   │
│  │  Button, Card, Dialog, Tabs, Dropdown, Badge, Spinner, Toast, etc.      │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  State Management: React Hooks (useState, useCallback, useEffect)        │   │
│  │  Form Management: React Hook Form + Zod Validation                       │   │
│  │  Styling: Tailwind CSS 4.2 + tailwind-merge                              │   │
│  │  File Upload: Uploadthing React Client                                   │   │
│  │  PDF Rendering: react-pdf + pdfjs-dist                                   │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
            ┌───────▼────────┐ ┌───────▼────────┐ ┌──────▼───────┐
            │  API Routes    │ │ Server Actions │ │Uploadthing   │
            │  (Route        │ │ (admin.ts,     │ │Integration   │
            │  Handlers)     │ │ documents.ts)  │ │(File Upload) │
            └────────────────┘ └────────────────┘ └──────────────┘
                    │
                    └─────────────────┬──────────────────┐
                                      │                  │
                          ┌───────────▼────────────┐  ┌──▼─────────┐
                          │  Neon Serverless       │  │  Uploadthing│
                          │  PostgreSQL Driver     │  │  CDN        │
                          └───────────┬────────────┘  └─────────────┘
                                      │
                                      │
        ┌─────────────────────────────▼──────────────────────────┐
        │         PostgreSQL Database (Neon)                     │
        │  ┌─────────────────────────────────────────────────┐   │
        │  │ Tables:                                         │   │
        │  │ • schools (institutions)                        │   │
        │  │ • departments (academic divisions)             │   │
        │  │ • programs (degree programs)                   │   │
        │  │ • courses (individual courses)                 │   │
        │  │ • levels (academic levels)                     │   │
        │  │ • documents (core resource table)              │   │
        │  │ • resource_types (type definitions)            │   │
        │  │ • download_logs (usage tracking)               │   │
        │  │ • users (future auth)                          │   │
        │  │ • sessions (future auth)                       │   │
        │  └─────────────────────────────────────────────────┘   │
        └───────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

### 1. Browse/Search Flow (User Discovery)

```
User Browser
    │
    ├─ GET / (load homepage)
    │   └─ app/page.tsx renders
    │       ├─ Fetch /api/filters (schools, departments, programs, courses)
    │       └─ Display resource type tabs + sidebar filters
    │
    ├─ Click resource type tab (e.g., "Past Papers")
    │   ├─ handleResourceTypeChange() called
    │   ├─ Reset filters
    │   └─ Fetch /api/documents?resourceType=Past Papers
    │       └─ API returns filtered documents
    │       └─ Display ResourceCard for each document
    │
    ├─ Select filters (School → Department → Program → Course)
    │   ├─ onFilterChange() updates state
    │   ├─ Debounce 300ms
    │   └─ Fetch /api/documents?schoolId=1&courseId=5&resourceType=...
    │
    ├─ Click document card
    │   └─ PDFModal opens with react-pdf viewer
    │
    ├─ Click download button
    │   ├─ POST /api/documents/track-download (record download)
    │   │   └─ Insert into download_logs table
    │   │   └─ Increment documents.download_count
    │   └─ Open file in new tab
    │
    └─ Type in search box
        ├─ Debounce 300ms
        └─ Fetch /api/documents?search=query
```

### 2. Admin Upload Flow

```
Admin User
    │
    ├─ Navigate to /admin
    │   └─ app/admin/page.tsx renders
    │       ├─ Fetch all schools, departments, programs, courses, resources
    │       └─ Display tabbed interface
    │
    ├─ Click "Upload" tab
    │   └─ AdminUploadFormEnhanced renders
    │       ├─ Resource type dropdown
    │       └─ Common fields (Title, File, School, Dept, Program, Course)
    │
    ├─ Select resource type (e.g., "Journals")
    │   └─ Form fields update
    │       ├─ Show: Author, Publication Date, Abstract
    │       └─ Hide: Year, Semester, Exam Type
    │
    ├─ Fill form and select file
    │   ├─ Upload to Uploadthing (client-side)
    │   ├─ Uploadthing returns fileKey + fileUrl
    │   └─ Submit form
    │
    ├─ Form submit → Server Action
    │   │
    │   ├─ app/actions/documents.ts → createDocument()
    │   │   ├─ INSERT into documents table
    │   │   │   ├─ title, courseId, resourceTypeId
    │   │   │   ├─ author, publicationDate, abstract
    │   │   │   ├─ file_path, file_key
    │   │   │   └─ upload_status = 'pending'
    │   │   │
    │   │   └─ Trigger asynchronous thumbnail generation
    │   │       └─ Fetch POST /api/documents/process-thumbnail
    │   │           ├─ Download PDF from Uploadthing
    │   │           ├─ Extract first page with pdfjs-dist
    │   │           ├─ Convert to JPEG with Sharp
    │   │           ├─ Upload thumbnail to Uploadthing
    │   │           ├─ UPDATE documents table
    │   │           │   ├─ thumbnail_url, thumbnail_key
    │   │           │   └─ upload_status = 'completed'
    │   │           └─ Return success
    │   │
    │   └─ Return success to form
    │       └─ Toast notification "Document uploaded!"
    │       └─ Redirect to Documents tab
    │
    └─ View in Documents tab
        └─ Fetch /api/documents (admin view)
            └─ Display AdminDocumentList with delete option
```

### 3. Admin CRUD Operations Flow

```
Admin User
    │
    ├─ Click Schools tab
    │   └─ AdminTable + Modal renders
    │       ├─ Show existing schools in table
    │       └─ "Add School" button
    │
    ├─ Click "Add School"
    │   ├─ AdminModal opens
    │   ├─ Fill form (name, description)
    │   └─ Click "Create"
    │       │
    │       ├─ app/actions/admin.ts → createSchool()
    │       │   ├─ Validate input
    │       │   ├─ INSERT into schools table
    │       │   └─ Return inserted record
    │       │
    │       └─ Update state, refresh table
    │           └─ Toast "School created!"
    │
    ├─ Click Edit icon on school
    │   ├─ AdminModal opens with prefilled data
    │   ├─ Update form
    │   └─ Click "Update"
    │       │
    │       ├─ app/actions/admin.ts → updateSchool()
    │       │   ├─ UPDATE schools table WHERE id=X
    │       │   └─ Return updated record
    │       │
    │       └─ Refresh table
    │
    └─ Click Delete icon
        ├─ ConfirmDialog shows
        ├─ Click "Delete"
        │
        ├─ app/actions/admin.ts → deleteSchool()
        │   ├─ DELETE from schools WHERE id=X
        │   └─ Return success
        │
        └─ Remove from table
            └─ Toast "School deleted!"
```

---

## Database Relationships Diagram

```
                    ┌────────────────┐
                    │     Schools    │
                    │   (id, name)   │
                    └────────┬───────┘
                             │
                         1:N │
                             │
                    ┌────────▼────────────┐
                    │   Departments      │
                    │ (id, name, s_id)   │
                    └────────┬────────────┘
                             │
                         1:N │
                             │
                    ┌────────▼──────────────┐
                    │     Programs         │
                    │ (id, name, code,d_id)│
                    └────────┬──────────────┘
                             │
                         1:N │
                             │
                    ┌────────▼────────────────┐
                    │      Courses           │
                    │ (id, name, code, p_id) │
                    └────────┬────────────────┘
                             │
                         1:N │
                             │
    ┌────────────────────────┴─────────────────────────┐
    │                                                   │
    │ ┌──────────────────────────────────────────────┐ │
    │ │       Documents (Core Resource Table)       │ │
    │ │   (id, title, course_id, resource_type_id,  │ │
    │ │    author, abstract, year, semester, etc.)  │ │
    │ └──────────────────────────────────────────────┘ │
    │                     │                            │
    │                 1:N │                            │
    │                     │                        1:N │
    │                     │                            │
    │    ┌────────────────▼──────────────┐ ┌──────────▼────────────────┐
    │    │   Download Logs               │ │   Resource Types          │
    │    │   (id, doc_id, timestamp...)  │ │   (id, name, icon, color) │
    │    └───────────────────────────────┘ └───────────────────────────┘
    │
    │ ┌──────────────────────┐
    │ │     Levels           │
    │ │  (id, name) [unused] │
    │ └──────────────────────┘
    │
    │ ┌──────────────────────────────┐
    │ │   Users [Future Auth]        │
    │ │  (id, email, password, role) │
    │ └────────┬─────────────────────┘
    │          │
    │      1:N │
    │          │
    │ ┌────────▼────────────────────┐
    │ │   Sessions [Future Auth]    │
    │ │  (id, user_id, token)       │
    │ └─────────────────────────────┘
    │
    └─────────────────────────────────
```

---

## Component Hierarchy

```
app/page.tsx (Browse Page)
├── Header
│   └── Search input
├── Resource Type Tabs Container
│   ├── TabButton (All Resources)
│   ├── TabButton (Past Papers)
│   ├── TabButton (Journals)
│   ├── TabButton (Dissertations)
│   ├── TabButton (Course Outlines)
│   └── TabButton (Research Papers)
├── Filter Sidebar (Conditional)
│   ├── AllResourcesFilter (if tab='all')
│   ├── PastPapersFilter (if tab='past-papers')
│   │   ├── FilterSection (School)
│   │   ├── FilterSection (Department)
│   │   ├── FilterSection (Program)
│   │   ├── FilterSection (Course)
│   │   ├── FilterSection (Year)
│   │   ├── FilterSection (Semester)
│   │   └── FilterSection (Exam Type)
│   ├── JournalsFilter (if tab='journals')
│   └── [Other type filters...]
└── Document Grid
    └── ResourceCard (repeating)
        ├── Badge (resource type)
        ├── Document metadata
        ├── PDF preview thumbnail
        └── Download button

app/admin/page.tsx (Admin Panel)
├── Tab Navigation
│   ├── Tab (Upload)
│   ├── Tab (Schools)
│   ├── Tab (Departments)
│   ├── Tab (Programs)
│   ├── Tab (Courses)
│   ├── Tab (Levels)
│   └── Tab (Documents)
├── Tab Content (Conditional)
│   ├── AdminUploadFormEnhanced
│   │   ├── Resource Type Dropdown
│   │   ├── School Select
│   │   ├── Department Select
│   │   ├── Program Select
│   │   ├── Course Select
│   │   ├── Common Fields (Title, File)
│   │   └── Type-Specific Fields (Conditional)
│   │       ├── Author (Journals, Dissertations)
│   │       ├── Publication Date (Journals)
│   │       ├── Abstract (Dissertations, Journals)
│   │       ├── Year (Past Papers)
│   │       ├── Semester (Past Papers)
│   │       └── Exam Type (Past Papers)
│   │
│   ├── AdminTable (Schools/Depts/etc.)
│   │   ├── Table rows
│   │   │   ├── Edit button → AdminModal
│   │   │   └── Delete button → ConfirmDialog
│   │   └── Add button → AdminModal (create mode)
│   │
│   └── AdminDocumentList
│       └── Document row
│           ├── Document info
│           ├── Thumbnail
│           ├── Download count
│           └── Delete button
│
├── AdminModal (Create/Edit)
│   ├── Form fields (dynamic based on entity type)
│   ├── Cancel button
│   └── Save button
│
└── ConfirmDialog (Delete Confirmation)
    ├── Warning message
    ├── Cancel button
    └── Delete button
```

---

## Data Flow - State Management

```
┌─────────────────────────────────────────────────────┐
│         Browse Page State Management                │
└─────────────────────────────────────────────────────┘

User Input
    ├─ Click resource type tab
    │   └─ handleResourceTypeChange()
    │       ├─ setActiveResourceType(newType)
    │       ├─ setFilters({} clear all)
    │       └─ useEffect triggers fetchDocuments()
    │
    ├─ Select filter option
    │   └─ handleFilterChange(key, value)
    │       ├─ setFilters({...filters, [key]: value})
    │       └─ useEffect triggers fetchDocuments() [debounced]
    │
    ├─ Type in search
    │   └─ setSearchQuery(query)
    │       └─ useEffect triggers fetchDocuments() [debounced]
    │
    └─ Fetch Documents (300ms debounce)
        └─ fetchDocuments()
            ├─ Build URLSearchParams from state
            ├─ GET /api/documents?...params
            ├─ Parse JSON response
            └─ setDocuments(response.data)
            └─ Render ResourceCard for each document

State Updates Trigger Component Re-renders:
    ├─ activeResourceType change
    │   └─ Filter sidebar re-renders (different component)
    │   └─ Tab buttons highlight changes
    │
    ├─ filters change
    │   └─ Sidebar filter options update
    │   └─ Dependent selects populate
    │
    ├─ documents change
    │   └─ Document grid re-renders
    │   └─ ResourceCard components update
    │
    └─ loading change
        └─ Spinner shows/hides during fetch
```

---

## Error Handling Flow

```
┌──────────────────────────────┐
│  Try-Catch in Server Actions │
└──────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
Success            Error
    │                 │
    └─► Return        └─► console.error()
        response          Return error object
        success:true      success: false
                          error: message

┌──────────────────────────────────┐
│  API Route Error Handling         │
└──────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
Success            Error
    │                 │
    └─► Return JSON   └─► console.error()
        {               Return Response.json()
          success:true    {
          data: [...]      success: false
        }                  error: "message"
                           data: []
                         }

┌──────────────────────────────────────┐
│  Frontend Error Handling (Components) │
└──────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
data.success       !data.success
    │                 │
    └─► Update        └─► console.error()
        state         └─► Show empty state or
        Render            toast notification
        cards
```

---

## Deployment Architecture (Vercel)

```
GitHub Repository
    │
    │ (push to main)
    ▼
Vercel CI/CD
    │
    ├─ 1. Install dependencies
    │  └─ pnpm install
    │
    ├─ 2. Build project
    │  └─ next build
    │      ├─ Compile Next.js pages
    │      ├─ Compile API routes
    │      ├─ Compile Server Components
    │      └─ Optimize for production
    │
    ├─ 3. Deploy to Vercel Edge Network
    │  ├─ API Routes → Serverless Functions
    │  ├─ Pages → Static/Dynamic Rendering
    │  └─ Assets → CDN
    │
    ├─ 4. Set Environment Variables
    │  ├─ DATABASE_URL (Neon)
    │  └─ UPLOADTHING_TOKEN
    │
    └─ 5. Deploy complete
       └─ Available at https://project.vercel.app

Runtime Architecture:
    │
    ├─ Edge: Next.js Middleware (routing optimization)
    │
    ├─ Serverless Functions (API Routes)
    │  ├─ /api/documents
    │  ├─ /api/filters
    │  ├─ /api/documents/track-download
    │  └─ /api/documents/process-thumbnail
    │
    ├─ Neon Serverless DB Connection
    │  └─ HTTP driver (works in serverless)
    │
    └─ Uploadthing Integration
       └─ File upload & CDN delivery
```

---

## Security & Data Flow

```
┌────────────────────────────────────────────┐
│         Client → Server (HTTPS)            │
├────────────────────────────────────────────┤
│                                            │
│  Browser Request with sensitive data       │
│      ├─ Encrypted by TLS/HTTPS            │
│      ├─ Query params for GET requests     │
│      ├─ Request body for POST             │
│      └─ Verified at Vercel edge           │
│                                            │
│  Server Processing                        │
│      ├─ Validate input types              │
│      ├─ Parameterized SQL queries         │
│      ├─ No data logged to console         │
│      └─ Errors sanitized before response  │
│                                            │
│  Database Response                        │
│      ├─ Query via Neon HTTPS              │
│      ├─ Data encryption at rest           │
│      ├─ SQL injection prevention          │
│      └─ Safe return to API route          │
│                                            │
│  Server → Browser Response                │
│      ├─ JSON serialization                │
│      ├─ HTTPS encryption                  │
│      ├─ CORS headers verified             │
│      └─ Content-Security-Policy enforced  │
│                                            │
└────────────────────────────────────────────┘
```

---

## Scaling & Performance Considerations

```
Current Architecture:
├─ Serverless functions (auto-scale)
├─ Database connections (Neon pooling)
├─ File storage (Uploadthing CDN)
├─ Static assets (Vercel CDN)
└─ Image optimization (Sharp processing)

Performance Optimizations:
├─ Query pagination (LIMIT 100)
├─ Debounced API calls (300ms)
├─ Thumbnail caching (pre-generated)
├─ Client-side form validation
├─ Lazy PDF modal loading
├─ Responsive image sizes
└─ Minified CSS/JS bundling

Potential Bottlenecks & Solutions:
├─ Thumbnail generation → Process async
├─ Large document list → Pagination
├─ Filter options fetch → Cache in state
├─ Search across large dataset → Full-text DB index
├─ Concurrent uploads → Rate limiting
└─ User sessions → Redis caching (future)
```

---

**Last Updated:** 2026-06-03  
**Framework Version:** Next.js 16.2.0  
**React Version:** 19.2.4  
**Database:** Neon PostgreSQL Serverless

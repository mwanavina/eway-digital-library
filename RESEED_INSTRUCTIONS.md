# How to Reseed the Database

## Run the Reseed Script

To reseed the database with updated course names (Java Programming I & II) and the real PDF link, follow these steps:

### Option 1: Using the System Action (Recommended in v0)

1. Go to the v0 chat where you're building this project
2. Ask to execute the reseed script with the following permission request:
   ```
   Please execute `/vercel/share/v0-project/scripts/reseed-data.js`
   ```
3. The script will:
   - Clear all existing data
   - Recreate schools, departments, programs, and courses
   - Rename Programming courses to "Java Programming I" and "Java Programming II"
   - Seed documents with the real PDF link for Java Programming courses
   - Insert all other courses with placeholder paths

### Option 2: Using Node.js (If Running Locally)

If you're running this locally, you can run:

```bash
node scripts/reseed-data.js
```

Make sure your `.env.local` file has the `DATABASE_URL` environment variable set correctly.

## What Gets Updated

- **Course Names**: "Programming I" → "Java Programming I" and "Programming II" → "Java Programming II"
- **PDF Link**: All Java Programming courses now link to: `https://zzjf1hsa23.ufs.sh/f/1Ra2MJPbK4SNi9kFbehD491UQOuKvxGNfMCgbTqp5SwEzLWP`
- **Data**: 
  - 3 Schools
  - 5 Departments
  - 5 Programs
  - 12 Courses (including Java Programming I & II)
  - 96 Documents (4 years × 2 semesters × 2 exam types × 12 courses)

## After Reseeding

1. The database will be cleared and repopulated with fresh data
2. Visit the app - you'll see Java Programming courses with the real PDF thumbnail
3. Click "View Preview" on any Java Programming document to see the PDF first page
4. Click "Download PDF" to download the actual PDF file

## Features Added

- **PDF Thumbnails**: First page of PDFs is shown as thumbnails in the document cards
- **PDF Preview Modal**: Users can preview the first page in a modal dialog before downloading
- **Smart Download**: Direct link to download the actual PDF file

const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  try {
    console.log('[v0] Seeding resource types...');

    // Clear existing resource types
    await sql`DELETE FROM resource_types`;
    console.log('[v0] Cleared existing resource types');

    // Seed resource types
    await sql`
      INSERT INTO resource_types (name, description, icon, color) VALUES
      ('Past Papers', 'Previous examination papers and question banks', 'FileText', '#1782C5'),
      ('Journals', 'Academic journals and research publications', 'BookOpen', '#1F2557'),
      ('Dissertations', 'Student dissertations and theses', 'Book', '#8B5A8F'),
      ('Course Outlines', 'Course syllabus and curriculum documents', 'ClipboardList', '#F59E0B'),
      ('Research Papers', 'Research articles and case studies', 'Microscope', '#10B981')
    `;
    console.log('[v0] Resource types seeded successfully');
  } catch (error) {
    console.error('[v0] Seeding error:', error.message);
    process.exit(1);
  }
}

seed();

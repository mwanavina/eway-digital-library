const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL;
const sql = neon(databaseUrl);

const defaultResourceTypes = [
  { name: 'Past Papers', slug: 'past-papers', description: 'Previous examination papers and question banks', icon: 'FileText', color: '#1782C5' },
  { name: 'Books', slug: 'books', description: 'Books and learning resources for students', icon: 'Book', color: '#2563EB' },
  { name: 'Journals', slug: 'journals', description: 'Academic journals and research publications', icon: 'BookOpen', color: '#1F2557' },
  { name: 'Dissertations', slug: 'dissertations', description: 'Student dissertations and theses', icon: 'Book', color: '#8B5A8F' },
  { name: 'Course Outlines', slug: 'course-outlines', description: 'Course syllabus and curriculum documents', icon: 'ClipboardList', color: '#F59E0B' },
  { name: 'Research Papers', slug: 'research-papers', description: 'Research articles and case studies', icon: 'Microscope', color: '#10B981' },
];

async function seed() {
  try {
    console.log('[v0] Upserting resource types...');

    for (const type of defaultResourceTypes) {
      await sql`
        INSERT INTO resource_types (name, slug, description, icon, color)
        VALUES (${type.name}, ${type.slug}, ${type.description}, ${type.icon}, ${type.color})
        ON CONFLICT (name)
        DO UPDATE SET
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          color = EXCLUDED.color
      `;
    }

    const rows = await sql`SELECT id, name, slug, icon, color FROM resource_types ORDER BY name;`;
    console.log('[v0] Resource types seeded successfully');
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('[v0] Seeding error:', error.message);
    process.exit(1);
  }
}

seed();

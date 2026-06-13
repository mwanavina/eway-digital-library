import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function seedData() {
  try {
    console.log('[v0] Starting database seed...');

    // Check if data already exists
    const existingCount = await sql`SELECT COUNT(*) as count FROM schools`;
    if (existingCount[0].count > 0) {
      console.log('[v0] Data already exists, skipping seed');
      return;
    }

    // Seed Schools one by one
    const school1 = await sql`
      INSERT INTO schools (name) VALUES ('School of Science and Technology')
      RETURNING id
    `;
    const school2 = await sql`
      INSERT INTO schools (name) VALUES ('School of Engineering')
      RETURNING id
    `;
    const school3 = await sql`
      INSERT INTO schools (name) VALUES ('School of Business')
      RETURNING id
    `;
    console.log('[v0] Schools seeded');

    const sid1 = school1[0].id;
    const sid2 = school2[0].id;
    const sid3 = school3[0].id;

    // Seed Departments
    const dept1 = await sql`
      INSERT INTO departments (name, school_id) VALUES ('Computer Science and Information Systems', ${sid1})
      RETURNING id
    `;
    const dept2 = await sql`
      INSERT INTO departments (name, school_id) VALUES ('Information Technology', ${sid1})
      RETURNING id
    `;
    const dept3 = await sql`
      INSERT INTO departments (name, school_id) VALUES ('Mechanical Engineering', ${sid2})
      RETURNING id
    `;
    const dept4 = await sql`
      INSERT INTO departments (name, school_id) VALUES ('Electrical Engineering', ${sid2})
      RETURNING id
    `;
    const dept5 = await sql`
      INSERT INTO departments (name, school_id) VALUES ('Business Administration', ${sid3})
      RETURNING id
    `;
    console.log('[v0] Departments seeded');

    const did1 = dept1[0].id;
    const did2 = dept2[0].id;
    const did3 = dept3[0].id;
    const did4 = dept4[0].id;
    const did5 = dept5[0].id;

    // Seed Levels
    await sql`
      INSERT INTO levels (level_number, description) VALUES 
      (1, 'Level 1'),
      (2, 'Level 2'),
      (3, 'Level 3'),
      (4, 'Level 4'),
      (5, 'Level 5')
    `;
    console.log('[v0] Levels seeded');

    // Seed Programs
    const prog1 = await sql`
      INSERT INTO programs (name, department_id) VALUES ('Bachelor of Information Technology', ${did1})
      RETURNING id
    `;
    const prog2 = await sql`
      INSERT INTO programs (name, department_id) VALUES ('Diploma in IT', ${did2})
      RETURNING id
    `;
    const prog3 = await sql`
      INSERT INTO programs (name, department_id) VALUES ('Bachelor of Mechanical Engineering', ${did3})
      RETURNING id
    `;
    const prog4 = await sql`
      INSERT INTO programs (name, department_id) VALUES ('Bachelor of Electrical Engineering', ${did4})
      RETURNING id
    `;
    const prog5 = await sql`
      INSERT INTO programs (name, department_id) VALUES ('Bachelor of Business Administration', ${did5})
      RETURNING id
    `;
    console.log('[v0] Programs seeded');

    const pid1 = prog1[0].id;
    const pid2 = prog2[0].id;
    const pid3 = prog3[0].id;
    const pid4 = prog4[0].id;
    const pid5 = prog5[0].id;

    // Seed Courses
    await sql`
      INSERT INTO courses (code, name, program_id) VALUES
      ('CS101', 'Programming I', ${pid1}),
      ('CS102', 'Programming II', ${pid1}),
      ('CS201', 'Data Structures', ${pid1}),
      ('CS202', 'Database Systems', ${pid1}),
      ('CS301', 'Web Development', ${pid1}),
      ('CS302', 'Software Engineering', ${pid1}),
      ('IT101', 'IT Fundamentals', ${pid2}),
      ('IT102', 'Networking I', ${pid2}),
      ('IT103', 'Networking II', ${pid2}),
      ('ME101', 'Engineering Mechanics', ${pid3}),
      ('EE101', 'Circuit Analysis', ${pid4}),
      ('BA101', 'Business Fundamentals', ${pid5})
    `;
    console.log('[v0] Courses seeded');

    // Get all courses
    const courses = await sql`SELECT id, name FROM courses`;
    
    // Real PDF link for Programming courses
    const realProgrammingPdfLink = 'https://zzjf1hsa23.ufs.sh/f/1Ra2MJPbK4SNi9kFbehD491UQOuKvxGNfMCgbTqp5SwEzLWP';
    
    // Seed Documents
    for (const course of courses) {
      for (let year = 2022; year <= 2025; year++) {
        for (let semester = 1; semester <= 2; semester++) {
          const examTypes = ['Mid-semester', 'End-semester'];
          for (const examType of examTypes) {
            const title = `${course.name} - ${year} Sem${semester} ${examType}`;
            
            // Use real PDF link for Programming courses, placeholder for others
            let filePath = `/documents/${course.id}/${year}/exam-${year}-s${semester}-${examType.replace('-', '')}.pdf`;
            if (course.name.includes('Programming')) {
              filePath = realProgrammingPdfLink;
            }
            
            await sql`
              INSERT INTO documents (title, course_id, year, semester, exam_type, file_path)
              VALUES (${title}, ${course.id}, ${year}, ${semester}, ${examType}, ${filePath})
            `;
          }
        }
      }
    }
    
    console.log('[v0] Documents seeded');
    console.log('[v0] Database seed completed successfully!');
  } catch (error) {
    console.error('[v0] Error seeding database:', error);
    process.exit(1);
  }
}

seedData();

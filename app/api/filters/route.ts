export async function GET() {
  try {
    // Mock filter options for demonstration
    const schools = [
      { id: 1, name: "School of Science" },
      { id: 2, name: "School of Engineering" },
      { id: 3, name: "School of Business" },
      { id: 4, name: "School of Health Sciences" },
      { id: 5, name: "School of ICT" },
    ];

    const departments = [
      { id: 1, school_id: 1, name: "Mathematics" },
      { id: 2, school_id: 1, name: "Physics" },
      { id: 3, school_id: 1, name: "Chemistry" },
      { id: 4, school_id: 2, name: "Civil Engineering" },
      { id: 5, school_id: 2, name: "Mechanical Engineering" },
      { id: 6, school_id: 3, name: "Finance" },
      { id: 7, school_id: 3, name: "Marketing" },
      { id: 8, school_id: 4, name: "Medicine" },
      { id: 9, school_id: 4, name: "Nursing" },
      { id: 10, school_id: 5, name: "Computer Science" },
    ];

    const programs = [
      { id: 1, department_id: 1, name: "BSc Mathematics" },
      { id: 2, department_id: 1, name: "BSc Applied Mathematics" },
      { id: 3, department_id: 4, name: "BSc Civil Engineering" },
      { id: 4, department_id: 5, name: "BSc Mechanical Engineering" },
      { id: 5, department_id: 6, name: "BCom Finance" },
      { id: 6, department_id: 10, name: "BSc Computer Science" },
    ];

    const courses = [
      { id: 1, program_id: 1, name: "Calculus I", code: "MATH101" },
      { id: 2, program_id: 1, name: "Calculus II", code: "MATH201" },
      { id: 3, program_id: 1, name: "Linear Algebra", code: "MATH301" },
      { id: 4, program_id: 3, name: "Engineering Mathematics", code: "ENG201" },
      { id: 5, program_id: 5, name: "Financial Mathematics", code: "BUS301" },
      { id: 6, program_id: 6, name: "Introduction to Programming", code: "CS101" },
    ];

    return Response.json({
      success: true,
      schools,
      departments,
      programs,
      courses,
    });
  } catch (error) {
    console.error('[v0] Error fetching filters:', error);
    return Response.json({
      success: false,
      schools: [],
      departments: [],
      programs: [],
      courses: [],
      error: error instanceof Error ? error.message : 'Failed to fetch filters',
    });
  }
}

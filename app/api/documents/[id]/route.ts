export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both async and sync params
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const documentId = parseInt(id);

    if (isNaN(documentId) || !id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid document ID',
        }),
        { status: 400 }
      );
    }

    // Mock documents
    const mockDocuments: { [key: number]: any } = {
      1: {
        id: 1,
        title: "Calculus I Mid-term Examination 2024",
        course_code: "MATH101",
        course_name: "Calculus I",
        year: 2024,
        semester: 1,
        exam_type: "semester",
        school_name: "School of Science",
        department_name: "Mathematics",
        file_path: "https://example.com/papers/calc1-midterm-2024.pdf",
        download_count: 145,
        resource_type_name: "Past Papers",
        author: null,
        publication_date: null,
        abstract: null,
      },
      2: {
        id: 2,
        title: "Applied Calculus in Engineering Simulations",
        course_code: "ENG201",
        course_name: "Engineering Mathematics",
        year: 2023,
        semester: 2,
        exam_type: "final",
        school_name: "School of Engineering",
        department_name: "Civil Engineering",
        file_path: "https://example.com/journals/applied-calc-eng.pdf",
        download_count: 82,
        resource_type_name: "Journal",
        author: "Dr. A. Phiri",
        publication_date: "2023-06-15",
        abstract: "An exploration of calculus applications in modern engineering projects.",
      },
      3: {
        id: 3,
        title: "Numerical Methods in Differential Calculus",
        course_code: "MATH201",
        course_name: "Numerical Methods",
        year: 2022,
        semester: 1,
        exam_type: "continuous",
        school_name: "School of Science",
        department_name: "Mathematics",
        file_path: "https://example.com/dissertations/numerical-methods.pdf",
        download_count: 37,
        resource_type_name: "Dissertations",
        author: "C. Banda",
        publication_date: "2022-05-20",
        abstract: "A comprehensive study on numerical approaches to solving differential equations.",
      },
    };

    const document = mockDocuments[documentId];

    if (!document) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Document not found',
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: document,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error fetching document:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch document',
      }),
      { status: 500 }
    );
  }
}

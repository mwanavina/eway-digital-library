import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  bookmarks,
  courses,
  departments,
  documents,
  levels,
  programs,
  resourceTypes,
  schools,
  userProfiles,
} from '@/lib/db/schema';

interface GetBookmarksOptions {
  userId?: string | null;
  userRole?: string;
}

export async function getBookmarksForUser(options: GetBookmarksOptions) {
  if (!options.userId) {
    return [];
  }

  const isAdmin = options.userRole === 'admin';

  const profileRows = options.userId
    ? await db
        .select({ levelId: userProfiles.levelId })
        .from(userProfiles)
        .where(eq(userProfiles.userId, options.userId))
        .limit(1)
    : [];

  const userLevelId = profileRows[0]?.levelId ?? null;

  const conditions = [eq(bookmarks.userId, options.userId)];

  if (!isAdmin && userLevelId !== null) {
    conditions.push(eq(documents.levelId, userLevelId));
  }

  const rows = await db
    .select({
      id: documents.id,
      title: documents.title,
      course_code: courses.code,
      course_name: courses.name,
      year: documents.year,
      semester: documents.semester,
      exam_type: documents.examType,
      school_name: schools.name,
      department_name: departments.name,
      file_path: documents.filePath,
      thumbnail_url: documents.thumbnailUrl,
      download_count: documents.downloadCount,
      resource_type_id: documents.resourceTypeId,
      resource_type_name: resourceTypes.name,
      author: sql<string | null>`NULL`,
      publication_date: sql<string | null>`NULL`,
      abstract: sql<string | null>`NULL`,
      bookmarked_at: bookmarks.createdAt,
    })
    .from(bookmarks)
    .innerJoin(documents, eq(bookmarks.documentId, documents.id))
    .leftJoin(courses, eq(documents.courseId, courses.id))
    .leftJoin(programs, eq(courses.programId, programs.id))
    .leftJoin(departments, eq(programs.departmentId, departments.id))
    .leftJoin(schools, eq(departments.schoolId, schools.id))
    .leftJoin(resourceTypes, eq(documents.resourceTypeId, resourceTypes.id))
    .leftJoin(levels, eq(documents.levelId, levels.id))
    .where(and(...conditions))
    .orderBy(desc(bookmarks.createdAt), desc(documents.id));

  return rows.map((row) => ({
    ...row,
    level_name: null,
  }));
}

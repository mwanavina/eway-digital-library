import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  courses,
  departments,
  documents,
  levels,
  programs,
  resourceTypes,
  schools,
  userProfiles,
} from '@/lib/db/schema';

interface GetDocumentsOptions {
  userId?: string | null;
  userRole?: string;
  search?: string;
  schoolId?: string;
  departmentId?: string;
  programId?: string;
  courseId?: string;
  levelId?: string;
  year?: string;
  semester?: string;
  examType?: string;
  resourceType?: string;
}

export async function getResourceTypeCountsForUser(options: GetDocumentsOptions) {
  const isAdmin = options.userRole === 'admin';

  const profileRows = options.userId
    ? await db
        .select({ levelId: userProfiles.levelId })
        .from(userProfiles)
        .where(eq(userProfiles.userId, options.userId))
        .limit(1)
    : [];

  const userLevelId = profileRows[0]?.levelId ?? null;

  if (!isAdmin && !userLevelId) {
    return [];
  }

  const whereConditions = [] as any[];

  if (!isAdmin && userLevelId !== null) {
    whereConditions.push(eq(documents.levelId, userLevelId));
  }

  const rows = await db
    .select({
      resourceTypeName: resourceTypes.name,
      count: sql<number>`count(*)::int`,
    })
    .from(documents)
    .leftJoin(resourceTypes, eq(documents.resourceTypeId, resourceTypes.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .groupBy(resourceTypes.name)
    .orderBy(resourceTypes.name);

  return rows;
}

export async function getDocumentsForUser(options: GetDocumentsOptions) {
  const isAdmin = options.userRole === 'admin';
  const normalizedSearch = options.search?.trim();

  const profileRows = options.userId
    ? await db
        .select({ levelId: userProfiles.levelId })
        .from(userProfiles)
        .where(eq(userProfiles.userId, options.userId))
        .limit(1)
    : [];

  const userLevelId = profileRows[0]?.levelId ?? null;

  if (!isAdmin && !userLevelId) {
    return [];
  }

  const whereConditions = [] as any[];

  if (!isAdmin && userLevelId !== null) {
    whereConditions.push(eq(documents.levelId, userLevelId));
  }

  if (options.schoolId) {
    whereConditions.push(eq(schools.id, Number(options.schoolId)));
  }

  if (options.departmentId) {
    whereConditions.push(eq(departments.id, Number(options.departmentId)));
  }

  if (options.programId) {
    whereConditions.push(eq(programs.id, Number(options.programId)));
  }

  if (options.courseId) {
    whereConditions.push(eq(courses.id, Number(options.courseId)));
  }

  if (options.levelId) {
    whereConditions.push(eq(documents.levelId, Number(options.levelId)));
  }

  if (options.year) {
    whereConditions.push(eq(documents.year, Number(options.year)));
  }

  if (options.semester) {
    whereConditions.push(eq(documents.semester, Number(options.semester)));
  }

  if (options.examType) {
    whereConditions.push(eq(documents.examType, options.examType));
  }

  if (options.resourceType) {
    whereConditions.push(eq(resourceTypes.name, options.resourceType));
  }

  if (normalizedSearch) {
    const searchTerm = `%${normalizedSearch}%`;
    const searchConditions = [
      ilike(documents.title, searchTerm),
      ilike(courses.name, searchTerm),
      ilike(courses.code, searchTerm),
      ilike(schools.name, searchTerm),
      ilike(departments.name, searchTerm),
      ilike(programs.name, searchTerm),
    ];
    whereConditions.push(or(...searchConditions));
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
      level_id: documents.levelId,
      level_name: levels.description,
      level_number: levels.levelNumber,
    })
    .from(documents)
    .leftJoin(courses, eq(documents.courseId, courses.id))
    .leftJoin(programs, eq(courses.programId, programs.id))
    .leftJoin(departments, eq(programs.departmentId, departments.id))
    .leftJoin(schools, eq(departments.schoolId, schools.id))
    .leftJoin(resourceTypes, eq(documents.resourceTypeId, resourceTypes.id))
    .leftJoin(levels, eq(documents.levelId, levels.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(desc(documents.downloadCount), desc(documents.createdAt), desc(documents.id));

  return rows.map((row) => ({
    ...row,
    level_name: row.level_name ?? (row.level_number ? `Level ${row.level_number}` : null),
  }));
}

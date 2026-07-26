'use server';

import { db } from '@/lib/db';
import { user, userProfiles, levels, documents, programs, departments, schools, courses } from '@/lib/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';

export async function fetchAllUsers() {
  try {
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
        level: levels.description,
        levelNumber: levels.levelNumber,
        school: schools.name,
        department: departments.name,
        program: programs.name,
        onboardingCompleted: userProfiles.onboardingCompleted,
        createdAt: user.createdAt,
      })
      .from(user)
      .leftJoin(userProfiles, eq(user.id, userProfiles.userId))
      .leftJoin(levels, eq(userProfiles.levelId, levels.id))
      .leftJoin(schools, eq(userProfiles.schoolId, schools.id))
      .leftJoin(departments, eq(userProfiles.departmentId, departments.id))
      .leftJoin(programs, eq(userProfiles.programId, programs.id))
      .orderBy(desc(user.createdAt));

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function fetchUsersByLevel() {
  try {
    const rows = await db
      .select({
        level: levels.description,
        levelNumber: levels.levelNumber,
        count: count(user.id),
      })
      .from(user)
      .leftJoin(userProfiles, eq(user.id, userProfiles.userId))
      .leftJoin(levels, eq(userProfiles.levelId, levels.id))
      .groupBy(levels.id, levels.description, levels.levelNumber)
      .orderBy(levels.levelNumber);

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching users by level:', error);
    return { success: false, error: 'Failed to fetch users by level' };
  }
}

export async function fetchTopDocumentsByDownloads() {
  try {
    const rows = await db
      .select({
        id: documents.id,
        title: documents.title,
        downloadCount: documents.downloadCount,
        level: levels.description,
        levelNumber: levels.levelNumber,
        program: programs.name,
        department: departments.name,
        school: schools.name,
      })
      .from(documents)
      .leftJoin(levels, eq(documents.levelId, levels.id))
      .leftJoin(courses, eq(documents.courseId, courses.id))
      .leftJoin(programs, eq(courses.programId, programs.id))
      .leftJoin(departments, eq(programs.departmentId, departments.id))
      .leftJoin(schools, eq(departments.schoolId, schools.id))
      .orderBy(desc(documents.downloadCount))
      .limit(20);

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching top documents:', error);
    return { success: false, error: 'Failed to fetch top documents' };
  }
}

export async function fetchAdminStats() {
  try {
    const userCountResult = await db.select({ count: count() }).from(user);
    const documentCountResult = await db.select({ count: count() }).from(documents);
    
    const totalDownloads = await db
      .select({
        total: sql`CAST(COALESCE(SUM(${documents.downloadCount}), 0) AS INTEGER)`,
      })
      .from(documents);

    const downloadCount = totalDownloads[0]?.total as unknown as number || 0;

    return {
      success: true,
      data: {
        totalUsers: userCountResult[0]?.count || 0,
        totalDocuments: documentCountResult[0]?.count || 0,
        totalDownloads: Number(downloadCount),
      },
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { success: false, error: 'Failed to fetch admin stats' };
  }
}

'use server';

import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminActivities, user } from '@/lib/db/schema';
import { getServerSession } from '@/lib/auth/session';

export interface AdminActivityPayload {
  action: 'created' | 'updated' | 'deleted' | 'uploaded';
  entity: string;
  title: string;
  userId?: string;
  userName?: string;
}

export async function logAdminActivity(payload: AdminActivityPayload) {
  try {
    const session = await getServerSession();
    const actor = session?.user;

    if (!actor?.id) {
      return { success: false, error: 'No active admin session found.' };
    }

    const [activity] = await db
      .insert(adminActivities)
      .values({
        action: payload.action,
        entity: payload.entity,
        title: payload.title,
        actorId: actor.id,
        actorName: payload.userName ?? actor.name ?? 'Admin',
      })
      .returning({
        id: adminActivities.id,
        action: adminActivities.action,
        entity: adminActivities.entity,
        title: adminActivities.title,
        actorName: adminActivities.actorName,
        createdAt: adminActivities.createdAt,
      });

    return { success: true, data: activity };
  } catch (error) {
    console.error('Error logging admin activity:', error);
    return { success: false, error: 'Failed to log admin activity.' };
  }
}

export async function fetchAdminActivities(limit = 6) {
  try {
    const rows = await db
      .select({
        id: adminActivities.id,
        action: adminActivities.action,
        entity: adminActivities.entity,
        title: adminActivities.title,
        actorName: adminActivities.actorName,
        createdAt: adminActivities.createdAt,
      })
      .from(adminActivities)
      .orderBy(desc(adminActivities.createdAt))
      .limit(limit);

    return {
      success: true,
      data: rows.map((row) => ({
        id: String(row.id),
        action: row.action as 'created' | 'updated' | 'deleted' | 'uploaded',
        entity: row.entity,
        title: row.title,
        actorName: row.actorName,
        timestamp: row.createdAt ? new Date(row.createdAt).toLocaleString() : 'Just now',
      })),
    };
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return { success: false, error: 'Failed to fetch admin activities.' };
  }
}

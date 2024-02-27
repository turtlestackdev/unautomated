'use server';
import type { Insertable, Selectable } from 'kysely';
import type { ResumeObjective } from '@/database/schema';
import { db } from '@/database/client';

export interface ResumeData {
  objectives: Selectable<ResumeObjective>[];
}

export async function readUserData(userId: string): Promise<ResumeData> {
  const objectives = await db
    .selectFrom('resume_objectives')
    .selectAll()
    .where('user_id', '=', userId)
    .execute();

  return {
    objectives,
  };
}

export async function createObjective(
  value: Insertable<ResumeObjective>
): Promise<Selectable<ResumeObjective>> {
  return db.insertInto('resume_objectives').values(value).returningAll().executeTakeFirstOrThrow();
}

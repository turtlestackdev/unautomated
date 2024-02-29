'use server';
import type { Insertable, Selectable } from 'kysely';
import type { ResumeObjective } from '@/database/schema';
import { db } from '@/database/client';
import type { Job } from '@/models/employment';
import { getUserJobs } from '@/models/employment';

export interface ResumeData {
  objectives: Selectable<ResumeObjective>[];
  jobs: Job[];
}

export async function readUserData(userId: string): Promise<ResumeData> {
  const [objectives, jobs] = await Promise.all([getUserObjectives(userId), getUserJobs(userId)]);

  return {
    objectives,
    jobs,
  };
}

export async function getUserObjectives(userId: string): Promise<Selectable<ResumeObjective>[]> {
  return db.selectFrom('resume_objectives').selectAll().where('user_id', '=', userId).execute();
}

export async function createObjective(
  value: Insertable<ResumeObjective>
): Promise<Selectable<ResumeObjective>> {
  return db.insertInto('resume_objectives').values(value).returningAll().executeTakeFirstOrThrow();
}

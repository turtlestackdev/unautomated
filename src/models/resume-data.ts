'use server';
import type { Insertable, Selectable } from 'kysely';
import type { ResumeObjective } from '@/database/schema';
import { db } from '@/database/client';
import type { Job } from '@/models/employment';
import { getUserJobs } from '@/models/employment';
import type { Degree, Education } from '@/models/education/types';
import { degreeTypes, getUserEducation } from '@/models/education/data';

export interface ResumeData {
  objectives: Selectable<ResumeObjective>[];
  jobs: Job[];
  education: Education[];
  formOptions: {
    degrees: Degree[];
  };
}

export async function readUserData(userId: string): Promise<ResumeData> {
  const [objectives, jobs, education] = await Promise.all([
    getUserObjectives(userId),
    getUserJobs(userId),
    getUserEducation(userId),
  ]);

  return {
    objectives,
    jobs,
    education,
    formOptions: { degrees: degreeTypes },
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

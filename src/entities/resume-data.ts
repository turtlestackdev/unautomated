'use server';
import type { Selectable } from 'kysely';
import type { ResumeObjective } from '@/database/schema';
import type { Employment } from '@/entities/employment/types';
import { getUserJobs } from '@/entities/employment/data';
import type { Degree, Education } from '@/entities/education/types';
import { degreeTypes, getUserEducation } from '@/entities/education/data';
import { getUserObjectives } from '@/entities/objective/data';

export interface ResumeData {
  objectives: Selectable<ResumeObjective>[];
  jobs: Employment[];
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

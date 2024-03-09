'use server';
import type { Selectable } from 'kysely';
import type { ResumeObjective } from '@/database/schema';
import type { Employment } from '@/models/employment/types';
import { getUserJobs } from '@/models/employment/data';
import type { Degree, Education } from '@/models/education/types';
import { degreeTypes, getUserEducation } from '@/models/education/data';
import { getUserObjectives } from '@/models/objective/data';

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

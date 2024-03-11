'use server';
import type { Selectable } from 'kysely';
import type { ResumeObjective } from '@/database/schema';
import type { Employment } from '@/entities/employment/types';
import { getUserEmployment } from '@/entities/employment/data';
import type { Degree, Education } from '@/entities/education/types';
import { degreeTypes, getUserEducation } from '@/entities/education/data';
import { getUserObjectives } from '@/entities/objective/data';

export interface ResumeData {
  objectives: Selectable<ResumeObjective>[];
  employment: Employment[];
  education: Education[];
  formOptions: {
    degrees: Degree[];
  };
}

export async function readUserData(userId: string): Promise<ResumeData> {
  const [objectives, employment, education] = await Promise.all([
    getUserObjectives(userId),
    getUserEmployment(userId),
    getUserEducation(userId),
  ]);

  return {
    objectives,
    employment,
    education,
    formOptions: { degrees: degreeTypes },
  };
}

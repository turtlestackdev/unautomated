'use server';

import { sleep } from '@/lib/utils';
import type { FormResponse } from '@/lib/validation';
import { uploadResumeSchema } from '@/entities/resume/validation';
import type { ResumeData } from '@/entities/resume-data';
import { degreeTypes } from '@/entities/education/data';

type UploadResumeFormState = FormResponse<typeof uploadResumeSchema, ResumeData>;

export async function uploadResume(userId: string, data: FormData): Promise<UploadResumeFormState> {
  await sleep(5);
  const request = await uploadResumeSchema.safeParseAsync(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  return {
    status: 'success',
    model: {
      objectives: [],
      employment: [],
      education: [],
      formOptions: { degrees: degreeTypes },
    },
  };
}

'use server';

import { sleep } from '@/lib/utils';
import type { FormState } from '@/lib/validation';
import { uploadResumeSchema } from '@/entities/resume/validation';
import type { ResumeData } from '@/entities/resume-data';
import { degreeTypes } from '@/entities/education/data';

type UploadResumeFormState = FormState<typeof uploadResumeSchema, ResumeData>;

export async function uploadResume(
  userId: string,
  _prev: UploadResumeFormState,
  data: FormData
): Promise<UploadResumeFormState> {
  await sleep(5);
  const request = await uploadResumeSchema.safeParseAsync(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  return {
    status: 'success',
    model: {
      objectives: [],
      jobs: [],
      education: [],
      formOptions: { degrees: degreeTypes },
    },
  };
}

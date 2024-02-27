'use server';

import type { Selectable } from 'kysely';
import { sleep } from '@/lib/utils';
import type { FormState } from '@/lib/validation';
import { createObjectiveSchema } from '@/app/(authenticated)/un/experience/validation';
import type { ResumeObjective } from '@/database/schema';
import * as resumeData from '@/models/resume-data';

export async function uploadResume(
  _prev: { status: string },
  data: FormData
): Promise<{ status: string }> {
  //const resume = data.get('resume_file') as File;
  console.log(data);
  await sleep(5);

  return { status: 'done' };
}

type ObjectiveFormState = FormState<typeof createObjectiveSchema, Selectable<ResumeObjective>>;

export async function createObjective(
  userId: string,
  _prevState: ObjectiveFormState,
  data: FormData
): Promise<ObjectiveFormState> {
  const request = createObjectiveSchema.safeParse(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  try {
    const model = await resumeData.createObjective({ ...request.data, user_id: userId });
    return {
      status: 'success',
      message: 'Resume objective added',
      model,
    };
  } catch (error) {
    console.warn('Failed to insert objective', error);
    return {
      status: 'error',
      message: 'Could not save objective',
      errors: {
        formErrors: [],
        fieldErrors: {},
      },
    };
  }
}

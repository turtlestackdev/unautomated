'use server';

import type { Selectable } from 'kysely';
import { sleep } from '@/lib/utils';
import type { FormState } from '@/lib/validation';
import { formToObject } from '@/lib/validation';
import { jobSchema, objectiveSchema } from '@/app/(authenticated)/un/resume/validation';
import type { ResumeObjective } from '@/database/schema';
import * as resumeData from '@/models/resume-data';
import type { Job } from '@/models/employment';
import * as employment from '@/models/employment';

export async function uploadResume(
  _prev: { status: string },
  data: FormData
): Promise<{ status: string }> {
  //const resume = data.get('resume_file') as File;
  console.log(data);
  await sleep(5);

  return { status: 'done' };
}

type ObjectiveFormState = FormState<typeof objectiveSchema, Selectable<ResumeObjective>>;

export async function createObjective(
  userId: string,
  _prevState: ObjectiveFormState,
  data: FormData
): Promise<ObjectiveFormState> {
  const request = objectiveSchema.safeParse(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  const { is_default_objective: _, ...values } = {
    ...request.data,
    is_default: request.data.is_default_objective,
  };

  try {
    const model = await resumeData.createObjective({ ...values, user_id: userId });
    return {
      status: 'success',
      model,
    };
  } catch (error) {
    console.warn('Failed to insert objective', error);
    return {
      status: 'error',
      errors: {
        formErrors: [],
        fieldErrors: {},
      },
    };
  }
}

type JobFormState = FormState<typeof jobSchema, Job>;

export async function saveJob(
  userId: string,
  _prevState: JobFormState,
  data: FormData
): Promise<JobFormState> {
  const request = jobSchema.safeParse(formToObject(data));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  try {
    const model = await employment.saveJobDetails({ ...request.data, user_id: userId });
    return {
      status: 'success',
      model,
    };
  } catch (error) {
    console.warn('Failed to insert job', error);
    return {
      status: 'error',
      errors: {
        formErrors: [],
        fieldErrors: {},
      },
    };
  }
}

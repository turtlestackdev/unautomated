'use server';
import type { Selectable } from 'kysely';
import { type DeleteResponse, deleteSchema, type FormResponse } from '@/lib/validation';
import { objectiveSchema } from '@/entities/objective/validation';
import type { ResumeObjective } from '@/database/schema';
import * as objectives from '@/entities/objective/data';

type ObjectiveFormState = FormResponse<typeof objectiveSchema, Selectable<ResumeObjective>>;

export async function saveObjective(userId: string, data: FormData): Promise<ObjectiveFormState> {
  const request = objectiveSchema.safeParse(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }

  const { is_default_objective: _, ...values } = {
    ...request.data,
    is_default: request.data.is_default_objective,
  };

  try {
    const model = await objectives.saveObjective({ ...values, user_id: userId });
    return {
      status: 'success',
      model,
    };
  } catch (error) {
    console.warn('Failed to save objective', error);
    return {
      status: 'error',
      errors: {
        formErrors: [],
        fieldErrors: {},
      },
    };
  }
}

export async function deleteObjective(userId: string, data: FormData): Promise<DeleteResponse> {
  const request = deleteSchema.safeParse(Object.fromEntries(data.entries()));
  if (!request.success) {
    return { status: 'error', errors: request.error.flatten() };
  }
  try {
    await objectives.deleteObjective({ objectiveId: request.data.id, userId });
    return { status: 'success', model: { id: request.data.id } };
  } catch (error) {
    console.warn('could not delete objective, error');
    return {
      status: 'error',
      errors: { formErrors: ['Could not delete objective'], fieldErrors: {} },
    };
  }
}

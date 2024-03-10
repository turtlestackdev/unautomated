'use server';
import type { Selectable } from 'kysely';
import { type ZodType, type ZodTypeDef } from 'zod';
import type { FormState } from '@/lib/validation';
import { objectiveSchema } from '@/entities/objective/validation';
import type { ResumeObjective } from '@/database/schema';
import * as objectives from '@/entities/objective/data';

type ObjectiveFormState = FormState<typeof objectiveSchema, Selectable<ResumeObjective>>;

export async function saveObjective(
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
    const model = await objectives.saveObjective({ ...values, user_id: userId });
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

type DeleteObjectiveState = FormState<ZodType<null, ZodTypeDef, null>, null>;

export async function deleteObjective(
  userId: string,
  objectiveId: string,
  _prevState: DeleteObjectiveState,
  _data: FormData
): Promise<DeleteObjectiveState> {
  try {
    await objectives.deleteObjective({ objectiveId, userId });
    return { status: 'success', model: null };
  } catch (error) {
    console.warn('could not delete objective, error');
    return {
      status: 'error',
      errors: { formErrors: ['Could not delete objective'], fieldErrors: {} },
    };
  }
}

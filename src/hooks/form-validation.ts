import type { z, ZodType } from 'zod';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import type { FormState } from '@/models/validation';
import { initialFormState } from '@/models/validation';

interface FormValidationProps<T extends ZodType, M> {
  // the server function to use, any binding should be done prior to calling the hook
  action: (prev: FormState<T, M>, data: FormData) => Promise<FormState<T, M>>;
  // What to do when the form is created, e.g., open a panel
  onInit?: () => void;
  // What to do when the form submits successfully, e.g., close a panel and add the new model to the DOM
  onSuccess?: (state: { message: string; model: M }) => void;
  // What to do when the form returns an error, e.g., show a notification.
  onError?: (state: { errors: z.inferFlattenedErrors<T>; message?: string }) => void;
}

/**
 * This hook is used to create a consistent approach to form validation using server actions.
 * The generic T is a Zod schema used to validate form data.
 * The generic M is the model which will be returned from a successful form submission
 *
 */
export function useFormValidation<T extends ZodType, M>(
  props: FormValidationProps<T, M>
): [FormState<T, M>, (payload: FormData) => void] {
  const [state, action] = useFormState(props.action, initialFormState);

  useEffect(() => {
    if (state.status === 'new' && props.onInit) {
      props.onInit();
    }

    if (state.status === 'success' && props.onSuccess) {
      props.onSuccess(state);
    }

    if (state.status === 'error' && props.onError) {
      props.onError(state);
    }
  }, [state, props]);

  return [state, action];
}

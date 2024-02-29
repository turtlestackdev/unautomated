import type { z, ZodType } from 'zod';
import { useFormState } from 'react-dom';
import type { RefObject } from 'react';
import { useState, useEffect, useRef } from 'react';
import type { FormState } from '@/lib/validation';
import { formToObject, initialFormState } from '@/lib/validation';

interface FormValidationProps<T extends ZodType, M> {
  // the Zod schema to validate against
  schema: T;
  // the server function to use, any binding should be done prior to calling the hook
  action: (prev: FormState<T, M>, data: FormData) => Promise<FormState<T, M>>;
  // What to do when the form is created, e.g., open a panel
  onInit?: () => void;
  // What to do when the form submits successfully, e.g., close a panel and add the new model to the DOM
  onSuccess?: (model: M) => void;
  // What to do when the form returns an error, e.g., show a notification.
  onError?: (errors: z.inferFlattenedErrors<T>) => void;
}

/**
 * This hook is used to create a consistent approach to form validation using server actions.
 * The generic T is a Zod schema used to validate form data.
 * The generic M is the model which will be returned from a successful form submission
 *
 */
export function useFormValidation<T extends ZodType, M>(
  props: FormValidationProps<T, M>
): [
  RefObject<HTMLFormElement>,
  (payload: FormData) => void,
  () => void,
  z.inferFlattenedErrors<T> | null,
] {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<z.inferFlattenedErrors<T> | null>(null);
  const [state, action] = useFormState(props.action, initialFormState);

  const isValid = (): boolean => {
    if (!formRef.current) {
      return false;
    }

    const data = new FormData(formRef.current);
    const request = props.schema.safeParse(formToObject(data));
    if (!request.success) {
      const errorList = request.error.flatten();
      if (props.onError) {
        props.onError(errorList);
      }

      setErrors(errorList);

      return false;
    }

    return true;
  };

  const submit = (): void => {
    if (isValid()) {
      formRef.current?.requestSubmit();
    }
  };

  useEffect(() => {
    if (state.status === 'new' && props.onInit) {
      props.onInit();
    }

    if (state.status === 'success' && props.onSuccess) {
      props.onSuccess(state.model);
    }

    if (state.status === 'error') {
      if (props.onError) {
        props.onError(state.errors);
      }
      setErrors(state.errors);
    }
  }, [state, props]);

  return [formRef, action, submit, errors];
}

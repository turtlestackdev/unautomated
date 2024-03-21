import type { z, ZodType } from 'zod';
import { useFormState } from 'react-dom';
import type { RefObject } from 'react';
import { useCallback, useState, useEffect, useRef } from 'react';
import type { FormState } from '@/lib/validation';
import { formToObject, initialFormState } from '@/lib/validation';

interface FormValidationProps<T extends ZodType, M> {
  // the Zod schema to validate against
  schema?: T;
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
export function useFormValidation<T extends ZodType, M>({
  schema,
  onError,
  onInit,
  onSuccess,
  ...props
}: FormValidationProps<T, M>): {
  formRef: RefObject<HTMLFormElement>;
  action: (payload: FormData) => void;
  submit: () => void;
  setShouldSubmit: (shouldSubmit: boolean) => void;
  errors: z.inferFlattenedErrors<T> | null;
} {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<z.inferFlattenedErrors<T> | null>(null);
  const [state, action] = useFormState(props.action, initialFormState);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const submit = useCallback((): void => {
    const isValid = (): boolean => {
      if (!formRef.current) {
        return false;
      }

      // if no schema is passed, do not apply front end validation.
      if (!schema) {
        return true;
      }

      const data = new FormData(formRef.current);
      const request = schema.safeParse(formToObject(data));
      if (!request.success) {
        const errorList = request.error.flatten();
        if (onError) {
          onError(errorList);
        }

        setErrors(errorList);

        return false;
      }

      return true;
    };

    if (isValid()) {
      formRef.current?.requestSubmit();
    }
  }, [schema, onError]);

  useEffect(() => {
    if (state.status === 'new' && onInit) {
      onInit();
    }

    if (state.status === 'success') {
      if (onSuccess) {
        onSuccess(state.model);
      }
      setErrors(null);
    }

    if (state.status === 'error') {
      if (onError) {
        onError(state.errors);
      }
      setErrors(state.errors);
    }

    if (shouldSubmit) {
      // used for submissions that are dependent on DOM update changes.
      submit();
      setShouldSubmit(false);
    }
  }, [state, onError, onInit, onSuccess, props.action, shouldSubmit, submit]);

  return { formRef, action, submit, setShouldSubmit, errors };
}

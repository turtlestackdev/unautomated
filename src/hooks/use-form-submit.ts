import type { z, ZodType } from 'zod';
import { useTransition, useCallback, useState } from 'react';
import { type FormAction, formToObject } from '@/lib/validation';

interface FormValidationProps<T extends ZodType, M> {
  // the server function to use, any binding should be done prior to calling the hook
  action: FormAction<T, M>;
  // the Zod schema to validate against
  schema?: T;

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
export function useFormSubmit<T extends ZodType, M>({
  schema,
  ...props
}: FormValidationProps<T, M>): {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errors: z.inferFlattenedErrors<T> | null;
} {
  const [isPending, startTransaction] = useTransition();
  const [errors, setErrors] = useState<z.inferFlattenedErrors<T> | null>(null);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      const form = event.currentTarget;

      const data = new FormData(form);
      if (schema) {
        const request = schema.safeParse(formToObject(data));
        if (!request.success) {
          const errorList = request.error.flatten();
          if (props.onError) {
            props.onError(errorList);
          }

          setErrors(errorList);

          return;
        }
      }

      if (!isPending) {
        startTransaction(async () => {
          const state = await props.action(data);
          if (state.status === 'success') {
            if (props.onSuccess) {
              props.onSuccess(state.model);
            }
          }

          if (state.status === 'error') {
            if (props.onError) {
              props.onError(state.errors);
            }
          }
        });
      }
    },
    [schema, props, isPending]
  );

  return { onSubmit, errors };
}

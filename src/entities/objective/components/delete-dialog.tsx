import type { Selectable } from 'kysely';
import React from 'react';
import type { ZodType, ZodTypeDef } from 'zod';
import type { ResumeObjective } from '@/database/schema';
import { useFormValidation } from '@/hooks/use-form-validation';
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/dialog';
import { Button, Submit } from '@/components/button';
import type { deleteSchema, FormState } from '@/lib/validation';

export type DeleteAction = (
  prev: FormState<typeof deleteSchema, null>,
  data: FormData
) => Promise<FormState<typeof deleteSchema, null>>;

export function DeleteDialog({
  objective,
  ...props
}: {
  objective: Selectable<ResumeObjective>;
  action: (
    prev: FormState<ZodType<null, ZodTypeDef, null>, null>,
    data: FormData
  ) => Promise<FormState<ZodType<null, ZodTypeDef, null>, null>>;
  onSuccess: (id: string) => void;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const { formRef, action } = useFormValidation({
    action: props.action,
    onSuccess: () => {
      props.onSuccess(objective.id);
    },
  });

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form action={action} ref={formRef}>
        <input type="hidden" name="id" value={objective.id} />
        <DialogTitle>Delete objective</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the objective,{' '}
          <span className="font-semibold">{objective.name}</span>? This action cannot be undone.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={props.onClose}>
            Cancel
          </Button>
          <Submit color="brand">Delete</Submit>
        </DialogActions>
      </form>
    </Dialog>
  );
}

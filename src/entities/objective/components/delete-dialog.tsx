import type { Selectable } from 'kysely';
import React from 'react';
import type { ResumeObjective } from '@/database/schema';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/dialog';
import { Button, Submit } from '@/components/button';
import type { deleteSchema, FormAction } from '@/lib/validation';

export type DeleteAction = FormAction<typeof deleteSchema, string>;

export function DeleteDialog({
  objective,
  ...props
}: {
  objective: Selectable<ResumeObjective>;
  action: DeleteAction;
  onSuccess: (id: string) => void;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const { onSubmit } = useFormSubmit({
    action: props.action,
    onSuccess: () => {
      props.onSuccess(objective.id);
    },
  });

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form onSubmit={onSubmit}>
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

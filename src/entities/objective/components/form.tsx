import React from 'react';
import { clsx } from 'clsx';
import type { Selectable } from 'kysely';
import { type objectiveSchema } from '@/entities/objective/validation';
import { Button, Submit } from '@/components/button';
import type { ResumeObjective } from '@/database/schema';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Switch, SwitchField } from '@/components/switch';
import type { FormProps } from '@/lib/validation';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog';

export function ObjectiveForm({
  onSubmit,
  className,
  record,
  errors,
  onCancel,
  includeActions = true,
  ...props
}: FormProps<typeof objectiveSchema, Selectable<ResumeObjective>>): React.JSX.Element {
  return (
    <form onSubmit={onSubmit} className={clsx(className, 'space-y-8')} {...props}>
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Name</Label>
            <Input name="name" defaultValue={record?.name} errors={errors?.fieldErrors.name} />
          </Field>
          <Field>
            <Label>Objective</Label>
            <Textarea
              defaultValue={record?.objective}
              errors={errors?.fieldErrors.objective}
              name="objective"
              rows={8}
            />
          </Field>

          <SwitchField>
            <Label>Default</Label>
            <Description>Make this the default objective in new resumes</Description>
            <Switch defaultChecked={record?.is_default} name="is_default_objective" />
          </SwitchField>
        </FieldGroup>
        {record?.id ? <input name="id" type="hidden" value={record.id} /> : null}
      </Fieldset>

      {includeActions ? (
        <div className="flex place-content-end gap-2">
          {onCancel ? (
            <Button plain onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          <Submit color="brand">Save</Submit>
        </div>
      ) : null}
    </form>
  );
}

export function ObjectiveFormDialog({
  open,
  onClose,
  ...props
}: Omit<FormProps<typeof objectiveSchema, Selectable<ResumeObjective>>, 'includeActions'> & {
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const formId = `employment-form-dialog-${props.record?.id ?? 'new'}`;

  return (
    <Dialog open={open} onClose={onClose} size="xl">
      <DialogTitle>{props.record ? 'Edit Objective' : 'Add Objective'}</DialogTitle>
      <DialogBody>
        <ObjectiveForm {...props} includeActions={false} id={formId} />
        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Submit color="brand" form={formId}>
            Save
          </Submit>
        </DialogActions>
      </DialogBody>
    </Dialog>
  );
}

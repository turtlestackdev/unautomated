import React from 'react';
import { clsx } from 'clsx';
import type { Selectable } from 'kysely';
import { useFormValidation } from '@/hooks/use-form-validation';
import { objectiveSchema } from '@/entities/objective/validation';
import { Button, Submit } from '@/components/button';
import type { ResumeObjective } from '@/database/schema';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Switch, SwitchField } from '@/components/switch';
import type { FormAction } from '@/lib/validation';

type FormProps = {
  objective: Partial<Selectable<ResumeObjective>>;
  action: FormAction<typeof objectiveSchema, Selectable<ResumeObjective>>;
  onSave: (objective: Selectable<ResumeObjective>) => void;
  onCancel?: () => void;
  includeActions?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'form'>, 'action'>;

export function Form({
  onSave,
  className,
  objective,
  action,
  onCancel,
  includeActions = true,
  ...props
}: FormProps): React.JSX.Element {
  const { ref, onSubmit, errors } = useFormValidation({
    schema: objectiveSchema,
    action,
    onSuccess: onSave,
  });

  return (
    <form ref={ref} onSubmit={onSubmit} className={clsx(className, 'space-y-8')} {...props}>
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Name</Label>
            <Input name="name" defaultValue={objective.name} errors={errors?.fieldErrors.name} />
          </Field>
          <Field>
            <Label>Objective</Label>
            <Textarea
              defaultValue={objective.objective}
              errors={errors?.fieldErrors.objective}
              name="objective"
              rows={8}
            />
          </Field>

          <SwitchField>
            <Label>Default</Label>
            <Description>Make this the default objective in new resumes</Description>
            <Switch defaultChecked={objective.is_default} name="is_default_objective" />
          </SwitchField>
        </FieldGroup>
        {objective.id !== undefined ? <input name="id" type="hidden" value={objective.id} /> : null}
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

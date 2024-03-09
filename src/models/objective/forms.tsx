import React from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import type { Selectable } from 'kysely';
import { useFormValidation } from '@/hooks/use-form-validation';
import { objectiveSchema } from '@/models/objective/validation';
import { useSession } from '@/hooks/use-session';
import { Field, FieldGroup, Fieldset, Label } from '@/ui/fieldset';
import { Textarea } from '@/ui/textarea';
import { Switch } from '@/ui/switch';
import type { ResumeObjective } from '@/database/schema';
import { saveObjective } from '@/models/objective/actions';

interface ObjectiveFormProps {
  objective?: Selectable<ResumeObjective>;
}

export function ObjectiveForm({ objective }: ObjectiveFormProps): React.JSX.Element {
  const { user } = useSession();
  const [formRef, action, submit, setShouldSubmit, errors] = useFormValidation({
    schema: objectiveSchema,
    action: saveObjective.bind(null, user.id),
  });

  return (
    <form action={action} className="space-y-8" ref={formRef}>
      {objective ? <input name="id" type="hidden" value={objective.id} /> : null}
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Objective</Label>
            <Textarea
              defaultValue={objective?.objective}
              errors={errors?.fieldErrors.objective}
              name="objective"
              onBlur={(event) => {
                if (event.target.value !== objective?.objective) {
                  submit();
                }
              }}
              rows={10}
            />
          </Field>
          <HeadlessField className="flex grow place-content-end items-center gap-4">
            <Label>Is default?</Label>
            <Switch
              defaultChecked={objective?.is_default}
              name="is_default_objective"
              onChange={() => {
                setShouldSubmit(true);
              }}
            />
          </HeadlessField>
        </FieldGroup>
      </Fieldset>
    </form>
  );
}

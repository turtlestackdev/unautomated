import React from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import type { Selectable } from 'kysely';
import { useFormValidation } from '@/hooks/use-form-validation';
import { objectiveSchema } from '@/entities/objective/validation';
import { useSession } from '@/hooks/use-session';
import { Field, FieldGroup, Fieldset, Label } from '@/ui/fieldset';
import { Textarea } from '@/ui/textarea';
import { Switch } from '@/ui/switch';
import type { ResumeObjective } from '@/database/schema';
import { saveObjective } from '@/entities/objective/actions';
import { Submit } from '@/ui/button';
import { SaveIcon } from '@/ui/icons/action-icons';

type ObjectiveFormProps = Partial<Selectable<ResumeObjective>> & { autoSave?: boolean };

export function ObjectiveForm({
  autoSave = false,
  ...objective
}: ObjectiveFormProps): React.JSX.Element {
  const { user } = useSession();
  const [formRef, action, submit, setShouldSubmit, errors] = useFormValidation({
    schema: objectiveSchema,
    action: saveObjective.bind(null, user.id),
  });

  return (
    <form action={action} className="space-y-8" ref={formRef}>
      {objective.id ? <input name="id" type="hidden" value={objective.id} /> : null}
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Objective</Label>
            <Textarea
              defaultValue={objective.objective}
              errors={errors?.fieldErrors.objective}
              name="objective"
              onBlur={(event) => {
                if (autoSave && event.target.value !== objective.objective) {
                  submit();
                }
              }}
              rows={10}
            />
          </Field>
          <div className="flex place-content-end items-center">
            <HeadlessField className="flex place-content-end items-center gap-4">
              <Label>Default</Label>
              <Switch
                defaultChecked={objective.is_default}
                name="is_default_objective"
                onChange={() => {
                  if (autoSave) {
                    setShouldSubmit(true);
                  }
                }}
              />
            </HeadlessField>
            {!autoSave ? (
              <div className="grow text-right">
                <Submit plain title="save">
                  Save
                  <SaveIcon className="h-5 w-5 fill-brand-400" />
                </Submit>
              </div>
            ) : null}
          </div>
        </FieldGroup>
      </Fieldset>
    </form>
  );
}

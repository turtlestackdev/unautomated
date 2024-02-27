import type { ReactElement } from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import type { Selectable } from 'kysely';
import { createObjective } from '@/app/(authenticated)/un/experience/actions';
import { Field, FieldGroup, Label } from '@/ui/fieldset';
import { Switch } from '@/ui/switch';
import { Textarea } from '@/ui/textarea';
import { Submit } from '@/ui/button';
import type { SessionUser } from '@/auth';
import type { ResumeObjective } from '@/database/schema';
import { useFormValidation } from '@/hooks/form-validation';

export function CreateObjectiveForm({
  user,
  objectives,
}: {
  user: SessionUser;
  objectives: Selectable<ResumeObjective>[];
}): ReactElement {
  const serverAction = createObjective.bind(null, user.id);
  const [state, action] = useFormValidation({ action: serverAction });

  return (
    <form action={action}>
      <FieldGroup>
        <HeadlessField className="flex grow place-content-end items-center gap-4">
          <Label>Is Default?</Label>
          <Switch
            color="brand"
            defaultChecked={!objectives.some((objective) => objective.is_default)}
            name="is_default"
          />
        </HeadlessField>
        <Field>
          <Label className="sr-only">Objective</Label>
          <Textarea errors={state.errors?.fieldErrors.objective} name="objective" rows={10} />
        </Field>

        <div className="grow text-right">
          <Submit color="brand">Add objective</Submit>
        </div>
      </FieldGroup>
    </form>
  );
}

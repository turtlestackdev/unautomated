import React from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import { useSession } from '@/hooks/use-session';
import type { Employment } from '@/entities/employment/types';
import { useFormValidation } from '@/hooks/use-form-validation';
import { employmentSchema } from '@/entities/employment/validation';
import { saveEmployment } from '@/entities/employment/actions';
import { Field, FieldGroup, Label } from '@/ui/fieldset';
import { Input } from '@/ui/input';
import { DatePicker } from '@/ui/date-picker';
import { Switch } from '@/ui/switch';
import { Textarea } from '@/ui/textarea';
import { ListField } from '@/ui/form-elements/list-field';
import { CollapsibleSection } from '@/ui/layout/collapsible-section';

interface EmploymentFormProps {
  employment?: Employment;
  onChange: (employment: Employment) => void;
}

export function EmploymentForm({ employment, onChange }: EmploymentFormProps): React.JSX.Element {
  const { user } = useSession();
  const [formRef, action, submit, setShouldSubmit, errors] = useFormValidation({
    schema: employmentSchema,
    action: saveEmployment.bind(null, user.id),
    onSuccess: onChange,
  });

  const highlights = employment?.highlights.map((highlight) => highlight.description) ?? [];

  return (
    <form action={action} ref={formRef}>
      <FieldGroup className="pt-8">
        {employment?.id ? <input defaultValue={employment.id} name="id" type="hidden" /> : null}
        <Field>
          <Label>Company</Label>
          <Input
            defaultValue={employment?.company}
            errors={errors?.fieldErrors.company}
            name="company"
            onBlur={(event) => {
              if (event.target.value !== employment?.company) {
                submit();
              }
            }}
          />
        </Field>
        <Field>
          <Label>Job Title</Label>
          <Input
            defaultValue={employment?.title}
            errors={errors?.fieldErrors.title}
            name="title"
            onBlur={(event) => {
              if (event.target.value !== employment?.title) {
                submit();
              }
            }}
          />
        </Field>
        <div className="flex items-center gap-4">
          <Field className="">
            <Label>Start Date</Label>
            <DatePicker
              defaultValue={employment?.start_date ?? undefined}
              errors={errors?.fieldErrors.start_date}
              max={new Date()}
              multiColumn
              name="start_date"
              onChange={(date) => {
                if (date !== employment?.start_date) {
                  setShouldSubmit(true);
                }
              }}
            />
          </Field>
          <Field className="">
            <Label>End Date</Label>
            <DatePicker
              defaultValue={employment?.end_date ?? undefined}
              errors={errors?.fieldErrors.start_date}
              max={new Date()}
              min={employment?.start_date ?? undefined}
              multiColumn
              name="end_date"
              onChange={(date) => {
                if (date !== employment?.end_date) {
                  setShouldSubmit(true);
                }
              }}
            />
          </Field>
          <HeadlessField className="mt-8 flex grow place-content-end items-center gap-4">
            <Label>Is current position?</Label>
            <Switch
              defaultChecked={employment?.is_current_position}
              name="is_current_position"
              onChange={() => {
                setShouldSubmit(true);
              }}
            />
          </HeadlessField>
        </div>
        <Field>
          <Label>Description</Label>
          <Textarea
            defaultValue={employment?.description}
            errors={errors?.fieldErrors.description}
            name="description"
            onBlur={(event) => {
              if (event.target.value !== employment?.description) {
                submit();
              }
            }}
            rows={4}
          />
        </Field>

        <ListField
          items={highlights}
          label="Duties, achievements, highlights, etc."
          name="highlights"
          onChange={submit}
        />
      </FieldGroup>
    </form>
  );
}

export function EmploymentPanel(): React.JSX.Element {
  return (
    <CollapsibleSection title="Employment" show>
      <div>I AM A Section</div>
    </CollapsibleSection>
  );
}

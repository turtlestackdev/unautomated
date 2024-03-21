import React, { useState } from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import { format } from 'date-fns/fp';
import { useSession } from '@/hooks/use-session';
import type { Employment } from '@/entities/employment/types';
import { useFormValidation } from '@/hooks/use-form-validation';
import { employmentSchema } from '@/entities/employment/validation';
import { saveEmployment } from '@/entities/employment/actions';
import { Field, FieldGroup, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { DatePicker } from '@/components/date-picker';
import { Switch } from '@/components/switch';
import { Textarea } from '@/components/textarea';
import { ListField } from '@/components/form-elements/list-field';
import { CollapsibleSection } from '@/components/layout/collapsible-section';
import { Submit } from '@/components/button';
import { SaveIcon } from '@/components/icons/action-icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

interface EmploymentFormProps {
  employment?: Employment;
  onSave: (employment: Employment) => void;
  autoSave?: boolean;
}

export function EmploymentForm({
  employment,
  onSave,
  autoSave = false,
}: EmploymentFormProps): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action, submit, setShouldSubmit, errors } = useFormValidation({
    schema: employmentSchema,
    action: saveEmployment.bind(null, user.id),
    onSuccess: onSave,
  });

  const highlights = employment?.highlights.map((highlight) => highlight.description) ?? [];

  return (
    <form action={action} ref={formRef} className="max-w-2xl">
      <FieldGroup>
        {employment?.id ? <input defaultValue={employment.id} name="id" type="hidden" /> : null}
        <Field>
          <Label>Company</Label>
          <Input
            defaultValue={employment?.company}
            errors={errors?.fieldErrors.company}
            name="company"
            onBlur={(event) => {
              if (autoSave && event.target.value !== employment?.company) {
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
              if (autoSave && event.target.value !== employment?.title) {
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
                if (autoSave && date !== employment?.start_date) {
                  setShouldSubmit(true);
                }
              }}
            />
          </Field>
          <Field className="">
            <Label>End Date</Label>
            <DatePicker
              defaultValue={employment?.end_date ?? undefined}
              errors={errors?.fieldErrors.end_date}
              max={new Date()}
              min={employment?.start_date ?? undefined}
              multiColumn
              name="end_date"
              onChange={(date) => {
                if (autoSave && date !== employment?.end_date) {
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
                if (autoSave) {
                  setShouldSubmit(true);
                }
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
              if (autoSave && event.target.value !== employment?.description) {
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
          onChange={() => {
            if (autoSave) {
              submit();
            }
          }}
        />
        {autoSave ? null : (
          <div className="text-right">
            <Submit color="brand">
              Save <SaveIcon className="h-5 w-5" />
            </Submit>
          </div>
        )}
      </FieldGroup>
    </form>
  );
}

function shorthandDate(startDate: Date | null, endDate: Date | null): string {
  const start = startDate ? format('MMM yyyy', startDate) : '';
  const end = endDate ? format(' - MMM yyyy', endDate) : '';

  return `${start}${end}`;
}

export function EmploymentTable({ employment }: { employment: Employment[] }): React.JSX.Element {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Company</TableHeader>
          <TableHeader>Title</TableHeader>
          <TableHeader>Dates</TableHeader>
          <TableHeader>
            <span className="sr-only">Actions</span>
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {employment.map((job) => (
          <TableRow key={JSON.stringify(job)}>
            <TableCell>{job.company}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{shorthandDate(job.start_date, job.end_date)}</TableCell>
            <TableCell>...</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function EmploymentPanel({
  show = true,
  ...props
}: {
  employment?: Employment[];
  show?: boolean;
}): React.JSX.Element {
  const [employment, setEmployment] = useState<Employment[]>(props.employment ?? []);
  return (
    <CollapsibleSection title="Employment" show={show}>
      <EmploymentForm
        key={`${new Date().getTime()}`}
        onSave={(job) => {
          setEmployment([...employment, job]);
        }}
      />
      {employment.length > 0 ? <EmploymentTable employment={employment} /> : null}
    </CollapsibleSection>
  );
}

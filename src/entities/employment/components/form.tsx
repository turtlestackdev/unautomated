import React from 'react';
import { clsx } from 'clsx';
import { Field as HeadlessField } from '@headlessui/react';
import type { FormProps } from '@/lib/validation';
import { type employmentSchema } from '@/entities/employment/validation';
import { type Employment } from '@/entities/employment/types';
import { Field, FieldGroup, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { DatePicker } from '@/components/date-picker';
import { Switch } from '@/components/switch';
import { Textarea } from '@/components/textarea';
import { ListField } from '@/components/form-elements/list-field';
import { Button, Submit } from '@/components/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog';

type EmploymentFormProps = FormProps<typeof employmentSchema, Employment>;

export function EmploymentForm({
  record,
  onSubmit,
  errors,
  onCancel,
  includeActions = true,
  className,
  ...props
}: EmploymentFormProps): React.JSX.Element {
  const highlights = record?.highlights.map((highlight) => highlight.description) ?? [];

  return (
    <form onSubmit={onSubmit} className={clsx(className, 'space-y-8')} {...props}>
      <FieldGroup>
        <Field>
          <Label>Company</Label>
          <Input
            defaultValue={record?.company}
            errors={errors?.fieldErrors.company}
            name="company"
          />
        </Field>
        <Field>
          <Label>Job Title</Label>
          <Input defaultValue={record?.title} errors={errors?.fieldErrors.title} name="title" />
        </Field>
        <div className="flex flex-col items-end gap-0 space-y-8 lg:flex-row lg:items-center lg:gap-4 lg:space-y-0">
          <Field className="w-full">
            <Label>Start Date</Label>
            <DatePicker
              defaultValue={record?.start_date ?? undefined}
              errors={errors?.fieldErrors.start_date}
              max={new Date()}
              multiColumn
              name="start_date"
            />
          </Field>
          <Field className="w-full">
            <Label>End Date</Label>
            <DatePicker
              defaultValue={record?.end_date ?? undefined}
              errors={errors?.fieldErrors.end_date}
              max={new Date()}
              min={record?.start_date ?? undefined}
              multiColumn
              name="end_date"
            />
          </Field>

          <HeadlessField className="flex w-full grow items-center gap-2 pt-8 sm:place-content-end ">
            <Label>Current Job</Label>
            <Switch defaultChecked={record?.is_current_position} name="is_current_position" />
          </HeadlessField>
        </div>
        <Field>
          <Label>Description</Label>
          <Textarea
            defaultValue={record?.description}
            errors={errors?.fieldErrors.description}
            name="description"
            rows={4}
          />
        </Field>

        <ListField
          items={highlights}
          label="Duties, achievements, highlights, etc."
          name="highlights"
        />
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
        {record?.id ? <input defaultValue={record.id} name="id" type="hidden" /> : null}
      </FieldGroup>
    </form>
  );
}

export function EmploymentFormDialog({
  open,
  onClose,
  ...props
}: Omit<EmploymentFormProps, 'includeActions'> & {
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const formId = `employment-form-dialog-${props.record?.id ?? 'new'}`;

  return (
    <Dialog open={open} onClose={onClose} size="xl">
      <DialogTitle>{props.record ? 'Edit Employment' : 'Add Employment'}</DialogTitle>
      <DialogBody>
        <EmploymentForm {...props} includeActions={false} id={formId} />
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

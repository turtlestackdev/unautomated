import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Field as HeadlessField } from '@headlessui/react';
import type { z } from 'zod';
import type { deleteSchema, FormResponse } from '@/lib/validation';
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
import { Strong, Text } from '@/components/text';

export type SaveEmploymentAction = (
  prev: FormResponse<typeof employmentSchema, Employment>,
  data: FormData
) => Promise<FormResponse<typeof employmentSchema, Employment>>;

type FormProps = {
  employment?: Employment;
  onSubmit: (event: React.FormEvent) => void;
  errors: z.inferFlattenedErrors<typeof employmentSchema> | null;
  onCancel?: () => void;
  includeActions?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'form'>, 'action'>;

export const EmploymentForm = forwardRef(function EmploymentForm(
  { employment, onSubmit, errors, onCancel, includeActions = true, className, ...props }: FormProps,
  ref: React.ForwardedRef<HTMLFormElement>
): React.JSX.Element {
  const highlights = employment?.highlights.map((highlight) => highlight.description) ?? [];

  return (
    <form
      onSubmit={onSubmit}
      ref={ref}
      className={clsx(
        className,
        'space-y-8 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm'
      )}
      {...props}
    >
      <FieldGroup>
        <Field>
          <Label>Company</Label>
          <Input
            defaultValue={employment?.company}
            errors={errors?.fieldErrors.company}
            name="company"
          />
        </Field>
        <Field>
          <Label>Job Title</Label>
          <Input defaultValue={employment?.title} errors={errors?.fieldErrors.title} name="title" />
        </Field>
        <div className="flex flex-col items-end gap-0 space-y-8 lg:flex-row lg:items-center lg:gap-4 lg:space-y-0">
          <Field className="w-full">
            <Label>Start Date</Label>
            <DatePicker
              defaultValue={employment?.start_date ?? undefined}
              errors={errors?.fieldErrors.start_date}
              max={new Date()}
              multiColumn
              name="start_date"
            />
          </Field>
          <Field className="w-full">
            <Label>End Date</Label>
            <DatePicker
              defaultValue={employment?.end_date ?? undefined}
              errors={errors?.fieldErrors.end_date}
              max={new Date()}
              min={employment?.start_date ?? undefined}
              multiColumn
              name="end_date"
            />
          </Field>

          <HeadlessField className="flex w-full grow items-center gap-2 pt-8 sm:place-content-end ">
            <Label>Current Job</Label>
            <Switch defaultChecked={employment?.is_current_position} name="is_current_position" />
          </HeadlessField>
        </div>
        <Field>
          <Label>Description</Label>
          <Textarea
            defaultValue={employment?.description}
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
        {employment?.id ? <input defaultValue={employment.id} name="id" type="hidden" /> : null}
      </FieldGroup>
    </form>
  );
});

export const EmploymentFormDialog = forwardRef(function EmploymentFormDialog(
  {
    open,
    onClose,
    ...props
  }: Omit<FormProps, 'includeActions'> & {
    open: boolean;
    onClose: () => void;
  },
  ref: React.ForwardedRef<HTMLFormElement>
): React.JSX.Element {
  const formId = `employment-form-dialog-${props.employment?.id ?? 'new'}`;

  return (
    <Dialog open={open} onClose={onClose} size="xl">
      <DialogTitle>{props.employment ? 'Edit Employment' : 'Add Employment'}</DialogTitle>
      <DialogBody>
        <EmploymentForm ref={ref} {...props} includeActions={false} id={formId} />
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
});

export type DeleteEmploymentAction = (
  prev: FormResponse<typeof deleteSchema, null>,
  data: FormData
) => Promise<FormResponse<typeof deleteSchema, null>>;

export const DeleteEmploymentDialog = forwardRef(function DeleteEmploymentDialog(
  {
    job,
    ...props
  }: {
    job: Employment;
    onSubmit: (event: React.FormEvent) => void;
    errors: z.inferFlattenedErrors<typeof deleteSchema> | null;
    open: boolean;
    onClose: () => void;
  },
  ref: React.ForwardedRef<HTMLFormElement>
): React.JSX.Element {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form ref={ref} onSubmit={props.onSubmit}>
        <input type="hidden" name="id" value={job.id} />
        <DialogTitle>Delete objective</DialogTitle>
        <DialogBody className="leading-loose">
          <Text>Are you sure you want to delete the job:</Text>
          <Strong className="font-semibold">
            {job.title} - {job.company}
          </Strong>
          <Text>This action cannot be undone.</Text>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={props.onClose}>
            Cancel
          </Button>
          <Submit color="brand">Delete</Submit>
        </DialogActions>
      </form>
    </Dialog>
  );
});

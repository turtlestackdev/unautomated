import React from 'react';
import { clsx } from 'clsx';
import { Field as HeadlessField } from '@headlessui/react';
import type { deleteSchema, FormState } from '@/lib/validation';
import { employmentSchema } from '@/entities/employment/validation';
import { type Employment } from '@/entities/employment/types';
import { useFormValidation } from '@/hooks/use-form-validation';
import { Field, FieldGroup, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { DatePicker } from '@/components/date-picker';
import { Switch } from '@/components/switch';
import { Textarea } from '@/components/textarea';
import { ListField } from '@/components/form-elements/list-field';
import { Button, Submit } from '@/components/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog';

export type SaveEmploymentAction = (
  prev: FormState<typeof employmentSchema, Employment>,
  data: FormData
) => Promise<FormState<typeof employmentSchema, Employment>>;

type FormProps = {
  employment?: Employment;
  action: SaveEmploymentAction;
  onSave: (employment: Employment) => void;
  onCancel?: () => void;
  includeActions?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'form'>, 'action'>;

export function EmploymentForm({
  employment,
  action,
  onSave,
  onCancel,
  includeActions = true,
  className,
  ...props
}: FormProps): React.JSX.Element {
  const {
    formRef,
    action: save,
    errors,
    deltaTime,
  } = useFormValidation({
    schema: employmentSchema,
    action,
    onSuccess: onSave,
  });

  const highlights = employment?.highlights.map((highlight) => highlight.description) ?? [];

  return (
    <form
      key={deltaTime.getTime()}
      action={save}
      ref={formRef}
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
}

export function EmploymentFormDialog({
  open,
  onClose,
  ...props
}: Omit<FormProps, 'includeActions'> & {
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const formId = `employment-form-dialog-${props.employment?.id ?? 'new'}`;

  return (
    <Dialog open={open} onClose={onClose} size="xl">
      <DialogTitle>{props.employment ? 'Edit Employment' : 'Add Employment'}</DialogTitle>
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

export type DeleteEmploymentAction = (
  prev: FormState<typeof deleteSchema, null>,
  data: FormData
) => Promise<FormState<typeof deleteSchema, null>>;

export function DeleteEmploymentDialog({
  job,
  ...props
}: {
  job: Employment;
  action: DeleteEmploymentAction;
  onSuccess: (id: string) => void;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const { formRef, action, deltaTime } = useFormValidation({
    action: props.action,
    onSuccess: () => {
      props.onSuccess(job.id);
    },
  });

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form key={deltaTime.getTime()} action={action} ref={formRef}>
        <input type="hidden" name="id" value={job.id} />
        <DialogTitle>Delete objective</DialogTitle>
        <DialogDescription>
          <p>Are you sure you want to delete the job:</p>
          <p className="font-semibold">
            {job.title} - {job.company}
          </p>
          <p>This action cannot be undone.</p>
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

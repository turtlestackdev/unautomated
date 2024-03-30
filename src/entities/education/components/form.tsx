import React, { useState } from 'react';
import { clsx } from 'clsx';
import type { FormProps } from '@/lib/validation';
import { Field, FieldGroup, Fieldset, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { DatePicker } from '@/components/date-picker';
import { ListField } from '@/components/form-elements/list-field';
import { Button, Submit } from '@/components/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog';
import { type educationSchema } from '@/entities/education/validation';
import { type Degree, type Education } from '@/entities/education/types';
import { Combobox } from '@/components/combobox';

type EducationFormProps = FormProps<typeof educationSchema, Education> & { degrees: Degree[] };

export function EducationForm({
  record,
  onSubmit,
  errors,
  onCancel,
  includeActions = true,
  className,
  ...props
}: EducationFormProps): React.JSX.Element {
  const highlights = record?.highlights.map((highlight) => highlight.description) ?? [];
  const [degreeSearch, setDegreeSearch] = useState('');
  const degreeOptions = props.degrees
    .filter(
      (type) =>
        type.name.toLowerCase().startsWith(degreeSearch.toLowerCase()) ||
        type.id.toLowerCase().startsWith(degreeSearch.toLowerCase())
    )
    .map((type) => {
      return { id: type.id, value: type };
    });

  return (
    <form onSubmit={onSubmit} className={clsx(className, 'space-y-8')} {...props}>
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>School/University</Label>
            <Input defaultValue={record?.school} name="school" />
          </Field>
          <Field>
            <div className="grid grid-cols-10 gap-4">
              <Field className="col-span-3">
                <Label>Degree</Label>
                <Combobox
                  defaultValue={degreeOptions.find((degree) => degree.id === record?.degree)?.value}
                  displayValue={(value) => value?.name ?? ''}
                  name="degree"
                  onQueryChange={(event) => {
                    setDegreeSearch(event.currentTarget.value);
                  }}
                  options={degreeOptions}
                />
              </Field>
              <Field className="col-span-6">
                <Label>Field of study</Label>
                <Input defaultValue={record?.field_of_study} name="field_of_study" />
              </Field>
              <Field className="col-span-1">
                <Label>GPA</Label>
                <Input
                  defaultValue={record?.gpa ?? undefined}
                  name="gpa"
                  pattern="\d(?:\.\d\d?)?"
                  type="text"
                />
              </Field>
            </div>
          </Field>
          <div className="flex items-center gap-4">
            <Field className="grow">
              <Label>Location</Label>
              <Input defaultValue={record?.location} name="location" />
            </Field>
            <Field className="">
              <Label>Start Date</Label>
              <DatePicker
                defaultValue={record?.start_date ?? undefined}
                errors={errors?.fieldErrors.start_date}
                max={new Date()}
                multiColumn
                name="start_date"
              />
            </Field>
            <Field className="">
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
          </div>
          <ListField items={highlights} label="Scholastic achievements" name="highlights" />

          {record?.id ? <input defaultValue={record.id} name="id" type="hidden" /> : null}
        </FieldGroup>
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

export function EducationFormDialog({
  open,
  onClose,
  ...props
}: Omit<EducationFormProps, 'includeActions'> & {
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const formId = `education-form-dialog-${props.record?.id ?? 'new'}`;

  return (
    <Dialog open={open} onClose={onClose} size="2xl">
      <DialogTitle>{props.record ? 'Edit Education' : 'Add Education'}</DialogTitle>
      <DialogBody>
        <EducationForm {...props} includeActions={false} id={formId} />
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

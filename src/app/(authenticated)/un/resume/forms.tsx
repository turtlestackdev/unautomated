import type { ReactElement } from 'react';
import React, { useRef, useState, forwardRef } from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import type { Selectable } from 'kysely';
import type { z } from 'zod';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { createObjective, saveJob } from '@/app/(authenticated)/un/resume/actions';
import { Field, FieldGroup, Fieldset, Label, Legend } from '@/ui/fieldset';
import { Switch } from '@/ui/switch';
import { Textarea } from '@/ui/textarea';
import { Button, Submit } from '@/ui/button';
import type { SessionUser } from '@/lib/auth';
import type { ResumeObjective } from '@/database/schema';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { ResumeData } from '@/models/resume-data';
import { objectiveSchema, jobSchema } from '@/app/(authenticated)/un/resume/validation';
import { Input } from '@/ui/input';
import { Combobox } from '@/ui/combobox';
import type { Degree, Education } from '@/models/education/types';
import type { Job } from '@/models/employment';
import type { Optional, UnSaved } from '@/lib/utils';
import { DatePicker } from '@/ui/date-picker';
import { educationSchema } from '@/models/education/validation';
import { saveEducation } from '@/models/education/actions';

export function CreateObjectiveForm({
  user,
  objectives,
}: {
  user: SessionUser;
  objectives: Selectable<ResumeObjective>[];
}): ReactElement {
  const [formRef, action, _submit, _shouldSubmit, errors] = useFormValidation({
    schema: objectiveSchema,
    action: createObjective.bind(null, user.id),
  });

  return (
    <form action={action} className="space-y-8" ref={formRef}>
      <ObjectiveFormFields errors={errors ?? undefined} objectives={objectives} />
      <div className="grow text-right">
        <Submit color="brand">Add objective</Submit>
      </div>
    </form>
  );
}

function ObjectiveFormFields({
  objectives,
  errors,
}: {
  objectives: Selectable<ResumeObjective>[];
  errors?: z.inferFlattenedErrors<typeof objectiveSchema>;
}): ReactElement {
  return (
    <Fieldset>
      <FieldGroup>
        <Field>
          <Label>Objective</Label>
          <Textarea errors={errors?.fieldErrors.objective} name="objective" rows={10} />
        </Field>
        <HeadlessField className="flex grow place-content-end items-center gap-4">
          <Label>Is default?</Label>
          <Switch
            defaultChecked={!objectives.some((objective) => objective.is_default)}
            name="is_default_objective"
          />
        </HeadlessField>
      </FieldGroup>
    </Fieldset>
  );
}

type JobInfo = Optional<Job, 'user_id' | 'id'>;

function WorkHistoryFormFields({
  user,
  ...props
}: {
  jobs: Job[];
  user: SessionUser;
}): ReactElement {
  const emptyJob = (): [string, JobInfo] => {
    return [
      `${new Date().getTime()}`,
      {
        company: '',
        title: '',
        start_date: null,
        end_date: null,
        is_current_position: false,
        description: '',
        highlights: [],
      },
    ];
  };

  const initialJobs: Map<string, JobInfo> =
    props.jobs.length === 0
      ? new Map<string, JobInfo>([emptyJob()])
      : new Map(props.jobs.map((job) => [job.id, job]));
  const [jobs, setJobs] = useState(initialJobs);

  const updateJob = (key: string, updated: Job): void => {
    const updatedMap = new Map(
      [...jobs.entries()].map((job) => {
        if (job[0] === key) {
          return [updated.id, updated];
        }
        return job;
      })
    );
    setJobs(updatedMap);
  };

  const addJob = (): void => {
    setJobs(new Map([...jobs.entries(), emptyJob()]));
  };

  const removeJob = (key: string): void => {
    setJobs(new Map([...jobs.entries()].filter((job) => job[0] !== key)));
  };

  return (
    <Fieldset className="pt-8">
      <Legend className="flex items-center gap-4">
        <span className="grow">Employment History</span>

        <Button className="place-self-end" color="brand" onClick={addJob}>
          <PlusIcon /> Add job
        </Button>
      </Legend>
      <div className="space-y-8 divide-y divide-dashed divide-gray-300">
        {[...jobs.entries()].map(([key, job], idx) => (
          <div key={JSON.stringify(job)}>
            <JobDetailsForm
              job={job}
              onChange={(updated) => {
                updateJob(key, updated);
              }}
              user={user}
            />
            {idx > 0 && (
              <div className="mt-8 text-right">
                <Button
                  color="red"
                  onClick={() => {
                    removeJob(key);
                  }}
                >
                  <TrashIcon /> Remove job
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Fieldset>
  );
}

function JobDetailsForm({
  job,
  onChange,
  user,
}: {
  job: JobInfo;
  onChange: (job: Job) => void;
  user: SessionUser;
}): ReactElement {
  const [formRef, action, submit, setShouldSubmit, errors] = useFormValidation({
    schema: jobSchema,
    action: saveJob.bind(null, user.id),
    onSuccess: onChange,
  });

  const highlights = job.highlights.map((highlight) => highlight.description);

  return (
    <form action={action} ref={formRef}>
      <FieldGroup className="pt-8">
        {job.id ? <input defaultValue={job.id} name="id" type="hidden" /> : null}
        <Field>
          <Label>Company</Label>
          <Input
            defaultValue={job.company}
            errors={errors?.fieldErrors.company}
            name="company"
            onBlur={(event) => {
              if (event.target.value !== job.company) {
                submit();
              }
            }}
          />
        </Field>
        <Field>
          <Label>Job Title</Label>
          <Input
            defaultValue={job.title}
            errors={errors?.fieldErrors.title}
            name="title"
            onBlur={(event) => {
              if (event.target.value !== job.title) {
                submit();
              }
            }}
          />
        </Field>
        <div className="flex items-center gap-4">
          <Field className="">
            <Label>Start Date</Label>
            <DatePicker
              defaultValue={job.start_date ?? undefined}
              errors={errors?.fieldErrors.start_date}
              max={new Date()}
              multiColumn
              name="start_date"
              onChange={(date) => {
                if (date !== job.start_date) {
                  setShouldSubmit(true);
                }
              }}
            />
          </Field>
          <Field className="">
            <Label>End Date</Label>
            <DatePicker
              defaultValue={job.end_date ?? undefined}
              errors={errors?.fieldErrors.start_date}
              max={new Date()}
              min={job.start_date ?? undefined}
              multiColumn
              name="end_date"
              onChange={(date) => {
                if (date !== job.end_date) {
                  setShouldSubmit(true);
                }
              }}
            />
          </Field>
          <HeadlessField className="mt-8 flex grow place-content-end items-center gap-4">
            <Label>Is current position?</Label>
            <Switch
              defaultChecked={job.is_current_position}
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
            defaultValue={job.description}
            errors={errors?.fieldErrors.description}
            name="description"
            onBlur={(event) => {
              if (event.target.value !== job.description) {
                submit();
              }
            }}
            rows={4}
          />
        </Field>

        <BulletList
          items={highlights}
          label="Duties, achievements, highlights, etc."
          name="highlights"
          onChange={submit}
        />
      </FieldGroup>
    </form>
  );
}

const BulletItem = forwardRef(function BulletItem(
  {
    ...props
  }: {
    item: string;
    name?: string;
    onChange?: (value: string) => void;
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
  },
  ref: React.ForwardedRef<HTMLInputElement>
): ReactElement {
  return (
    <Field>
      <div className="mt-3 flex gap-2">
        <Input
          defaultValue={props.item}
          name={props.name ? `${props.name}[]` : undefined}
          onBlur={(event) => {
            props.onChange && props.onChange(event.target.value);
          }}
          ref={ref}
        />
        {props.onMoveUp ? (
          <Button color="light" onClick={props.onMoveUp}>
            <ArrowUpIcon />
          </Button>
        ) : null}
        {props.onMoveDown ? (
          <Button color="light" onClick={props.onMoveDown}>
            <ArrowDownIcon />
          </Button>
        ) : null}
        <Button
          color="light"
          onClick={() => {
            props.onDelete && props.onDelete();
          }}
        >
          <TrashIcon />
        </Button>
      </div>
    </Field>
  );
});

function BulletList(props: {
  items: string[];
  name?: string;
  label: string;
  onChange?: (items: string[]) => void;
}): ReactElement {
  const ref = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(props.items);
  const itemRefs = useRef<HTMLInputElement[]>([]);
  const pushItemRef = (el: HTMLInputElement): void => {
    itemRefs.current.push(el);
  };

  const addItem = (): void => {
    if (ref.current?.value.trim()) {
      setItems([ref.current.value.trim(), ...items]);
      if (props.onChange) {
        props.onChange(items);
      }

      ref.current.value = '';
    }
  };

  const updateItem = (index: number, value: string): void => {
    const current = items[index];
    if (current && current !== value) {
      setItems(items.toSpliced(index, 1, value.trim()));

      if (props.onChange) {
        props.onChange(items);
      }
    }
  };

  const removeItem = (index: number): void => {
    const item = itemRefs.current[index];
    if (item) {
      item.value = '';
    }
    setItems(items.toSpliced(index, 1));

    if (props.onChange) {
      props.onChange(items);
    }
  };

  const moveUp = (index: number): void => {
    if (index > 0) {
      const up = items[index];
      const upRef = itemRefs.current[index];
      const down = items[index - 1];
      const downRef = itemRefs.current[index - 1];

      if (up !== undefined && down !== undefined) {
        setItems(items.toSpliced(index - 1, 2, up, down));
        if (upRef && downRef) {
          upRef.value = down;
          downRef.value = up;
        }
      }

      if (props.onChange) {
        props.onChange(items);
      }
    }
  };

  const moveDown = (index: number): void => {
    if (index < items.length - 1) {
      const up = items[index + 1];
      const upRef = itemRefs.current[index + 1];
      const down = items[index];
      const downRef = itemRefs.current[index];

      if (up !== undefined && down !== undefined) {
        setItems(items.toSpliced(index, 2, up, down));
        if (upRef && downRef) {
          upRef.value = down;
          downRef.value = up;
        }
      }

      if (props.onChange) {
        props.onChange(items);
      }
    }
  };

  return (
    <>
      <Field>
        <Label>{props.label}</Label>
        <div className="mt-3 flex gap-2">
          <Input name={props.name ? `${props.name}[]` : undefined} ref={ref} />
          <Button color="brand" onClick={addItem}>
            <PlusIcon />
          </Button>
        </div>
      </Field>
      {items.map((item, index) => (
        <BulletItem
          item={item}
          key={item}
          name={props.name}
          onChange={(value) => {
            updateItem(index, value);
          }}
          onDelete={() => {
            removeItem(index);
          }}
          onMoveDown={
            index < items.length - 1
              ? () => {
                  moveDown(index);
                }
              : undefined
          }
          onMoveUp={
            index > 0
              ? () => {
                  moveUp(index);
                }
              : undefined
          }
          ref={pushItemRef}
        />
      ))}
    </>
  );
}

function EducationFormFields({
  user,
  education,
  degrees,
}: {
  user: SessionUser;
  education: UnSaved<Education>;
  degrees: Degree[];
}): ReactElement {
  const [formRef, action, submit, setShouldSubmit, errors] = useFormValidation({
    schema: educationSchema,
    action: saveEducation.bind(null, user.id),
    onError: (errs) => {
      console.error(errs);
    },
  });

  const [degreeSearch, setDegreeSearch] = useState('');
  const degreeOptions = degrees
    .filter(
      (type) =>
        type.name.toLowerCase().startsWith(degreeSearch.toLowerCase()) ||
        type.id.toLowerCase().startsWith(degreeSearch.toLowerCase())
    )
    .map((type) => {
      return { id: type.id, value: type };
    });

  const submitOnChange = (
    field: keyof Education
  ): ((event: React.FormEvent<HTMLInputElement>) => void) => {
    return (event) => {
      if (event.currentTarget.value !== education[field]) {
        submit();
      }
    };
  };

  return (
    <form action={action} id="edu-form" ref={formRef}>
      {education.id ? <input defaultValue={education.id} name="id" type="hidden" /> : null}
      <Fieldset className="pt-8">
        <Legend className="flex items-center gap-4">
          <span className="grow">Education</span>

          <Button className="place-self-end" color="brand">
            <PlusIcon /> Add degree
          </Button>
        </Legend>
        <FieldGroup>
          <Field>
            <Label>School/University</Label>
            <Input
              defaultValue={education.school}
              name="school"
              onBlur={submitOnChange('school')}
            />
          </Field>
          <Field>
            <div className="grid grid-cols-10 gap-4">
              <Field className="col-span-3">
                <Label>Degree</Label>
                <Combobox
                  defaultValue={
                    degreeOptions.find((degree) => degree.id === education.degree)?.value
                  }
                  displayValue={(value) => value?.name ?? ''}
                  name="degree"
                  onChange={() => {
                    setShouldSubmit(true);
                  }}
                  onQueryChange={(event) => {
                    setDegreeSearch(event.currentTarget.value);
                  }}
                  options={degreeOptions}
                />
              </Field>
              <Field className="col-span-6">
                <Label>Field of study</Label>
                <Input
                  defaultValue={education.field_of_study}
                  name="field_of_study"
                  onBlur={submitOnChange('field_of_study')}
                />
              </Field>
              <Field className="col-span-1">
                <Label>GPA</Label>
                <Input
                  defaultValue={education.gpa ?? undefined}
                  name="gpa"
                  onBlur={submitOnChange('gpa')}
                  pattern="\d(?:\.\d\d?)?"
                  type="text"
                />
              </Field>
            </div>
          </Field>
          <div className="flex items-center gap-4">
            <Field className="grow">
              <Label>Location</Label>
              <Input
                defaultValue={education.location}
                name="location"
                onBlur={submitOnChange('location')}
              />
            </Field>
            <Field className="">
              <Label>Start Date</Label>
              <DatePicker
                defaultValue={education.start_date ?? undefined}
                errors={errors?.fieldErrors.start_date}
                max={new Date()}
                multiColumn
                name="start_date"
                onChange={(date) => {
                  if (date !== education.start_date) {
                    setShouldSubmit(true);
                  }
                }}
              />
            </Field>
            <Field className="">
              <Label>End Date</Label>
              <DatePicker
                defaultValue={education.end_date ?? undefined}
                errors={errors?.fieldErrors.end_date}
                max={new Date()}
                min={education.start_date ?? undefined}
                multiColumn
                name="end_date"
                onChange={(date) => {
                  if (date !== education.end_date) {
                    setShouldSubmit(true);
                  }
                }}
              />
            </Field>
          </div>
          <BulletList
            items={education.highlights.map((highlight) => highlight.description)}
            label="Sholastic achievements"
            name="highlights"
            onChange={submit}
          />
        </FieldGroup>
      </Fieldset>
    </form>
  );
}

export function SkillsFields(): ReactElement {
  return (
    <Fieldset className="pt-8">
      <Legend className="flex items-center gap-4">
        <span className="grow">Skills</span>
      </Legend>
      <FieldGroup>
        <Field>
          <Label>Skills</Label>
          <div className="mt-3 flex gap-2">
            <Input name="highlight" />
            <Button color="brand">
              <PlusIcon />
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </Fieldset>
  );
}

export function CreateResumeForm({
  user,
  resumeData,
}: {
  user: SessionUser;
  resumeData: ResumeData;
}): ReactElement {
  const emptyEdu = (): [string, UnSaved<Education>] => {
    return [
      `${new Date().getTime()}`,
      {
        school: '',
        location: '',
        degree: '',
        field_of_study: '',
        gpa: null,
        start_date: null,
        end_date: null,
        highlights: [],
      },
    ];
  };

  const initialEdu: Map<string, UnSaved<Education>> = resumeData.education.length === 0
    ? new Map<string, UnSaved<Education>>([emptyEdu()])
    : new Map(resumeData.education.map((edu) => [edu.id, edu]));
  //const [education, setEducation] = useState(initialEdu);

  return (
    <div className="space-y-8 divide-y divide-gray-300">
      <ObjectiveFormFields objectives={resumeData.objectives} />
      <WorkHistoryFormFields jobs={resumeData.jobs} user={user} />
      {[...initialEdu.entries()].map(([key, edu]) => (
        <EducationFormFields
          degrees={resumeData.formOptions.degrees}
          education={edu}
          key={key}
          user={user}
        />
      ))}

      <SkillsFields />
    </div>
  );
}

import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import type { Selectable } from 'kysely';
import type { z } from 'zod';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { createObjective } from '@/app/(authenticated)/un/resume/actions';
import { Field, FieldGroup, Fieldset, Label, Legend } from '@/ui/fieldset';
import { Switch } from '@/ui/switch';
import { Textarea } from '@/ui/textarea';
import { Button, Submit } from '@/ui/button';
import type { SessionUser } from '@/lib/auth';
import type { ResumeObjective } from '@/database/schema';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { ResumeData } from '@/models/resume-data';
import { objectiveSchema } from '@/app/(authenticated)/un/resume/validation';
import { Input } from '@/ui/input';
import type { Education } from '@/models/education/types';
import type { Employment } from '@/models/employment/types';
import { EducationForm } from '@/models/education/forms';
import { EmploymentForm } from '@/models/employment/forms';

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

function WorkHistoryFormFields({
  ...props
}: {
  jobs: Employment[];
  user: SessionUser;
}): ReactElement {
  const initialJobs = new Map(props.jobs.map((job) => [job.id, job]));
  const [jobs, setJobs] = useState(initialJobs);

  const updateJob = (key: string, updated: Employment): void => {
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
    //setJobs(new Map([...jobs.entries(), emptyJob()]));
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
        <EmploymentForm
          onChange={(job) => {
            setJobs(new Map([...jobs.entries(), [job.id, job]]));
          }}
        />
        {[...jobs.entries()].map(([key, job], idx) => (
          <div key={JSON.stringify(job)}>
            <EmploymentForm
              employment={job}
              onChange={(updated) => {
                updateJob(key, updated);
              }}
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
  const initialEdu: Map<string, Education> = new Map<string, Education>(
    resumeData.education.map((edu) => [edu.id, edu])
  );
  //const [education, setEducation] = useState(initialEdu);

  return (
    <div className="space-y-8 divide-y divide-gray-300">
      <ObjectiveFormFields objectives={resumeData.objectives} />
      <WorkHistoryFormFields jobs={resumeData.jobs} user={user} />
      <EducationForm degrees={resumeData.formOptions.degrees} />
      {[...initialEdu.entries()].map(([key, edu]) => (
        <EducationForm degrees={resumeData.formOptions.degrees} education={edu} key={key} />
      ))}

      <SkillsFields />
    </div>
  );
}

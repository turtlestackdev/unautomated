import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { Field, FieldGroup, Fieldset, Label, Legend } from '@/ui/fieldset';
import { Button } from '@/ui/button';
import type { SessionUser } from '@/lib/auth';
import type { ResumeData } from '@/entities/resume-data';
import { Input } from '@/ui/input';
import type { Education } from '@/entities/education/types';
import type { Employment } from '@/entities/employment/types';
import { EducationForm } from '@/entities/education/forms';
import { EmploymentForm } from '@/entities/employment/components';
import { ObjectiveForm } from '@/entities/objective/components';

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
      {resumeData.objectives.map((objective) => (
        <ObjectiveForm key={objective.id} {...objective} />
      ))}
      <ObjectiveForm />
      <WorkHistoryFormFields jobs={resumeData.jobs} user={user} />
      <EducationForm degrees={resumeData.formOptions.degrees} />
      {[...initialEdu.entries()].map(([key, edu]) => (
        <EducationForm degrees={resumeData.formOptions.degrees} education={edu} key={key} />
      ))}

      <SkillsFields />
    </div>
  );
}

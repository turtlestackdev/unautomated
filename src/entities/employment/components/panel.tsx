import { PlusIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { CollapsibleSection } from '@/components/layout/collapsible-section';
import type { Employment } from '@/entities/employment/types';
import { H1, Text } from '@/components/text';
import { Button } from '@/components/button';
import {
  DeleteEmploymentDialog,
  EmploymentFormDialog,
} from '@/entities/employment/components/form';
import { EntityCard } from '@/components/cards/entity-card';
import { noop, shorthandDate } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { Card } from '@/components/cards/card';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { employmentSchema } from '@/entities/employment/validation';
import { deleteSchema, type FormAction } from '@/lib/validation';

export function EmploymentPanel(props: {
  employment: Employment[];
  saveAction: FormAction<typeof employmentSchema, Employment>;
  deleteAction: FormAction<typeof deleteSchema, string>;
  show?: boolean;
}): React.JSX.Element {
  const [employment, setEmployment] = useState(props.employment);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<Employment | undefined>(undefined);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<Employment | undefined>(undefined);

  const onCreate = (job: Employment): void => {
    setEmployment([...employment, job]);
  };

  const onEdit = (updated: Employment): void => {
    setEmployment(employment.map((job) => (job.id === updated.id ? updated : job)));
  };

  const onDelete = (id: string): void => {
    setEmployment(employment.filter((job) => job.id !== id));
  };

  const saveValidation = useFormSubmit({
    schema: employmentSchema,
    action: props.saveAction,
    onSuccess: (job: Employment) => {
      setShowForm(false);
      editRecord ? onEdit(job) : onCreate(job);
      setEditRecord(undefined);
    },
  });

  const saveDialog = (
    <EmploymentFormDialog
      employment={editRecord}
      {...saveValidation}
      open={showForm}
      onClose={() => {
        setShowForm(false);
      }}
    />
  );

  const deleteValidation = useFormSubmit({
    schema: deleteSchema,
    action: props.deleteAction,
    onSuccess: (id) => {
      setShowDelete(false);
      onDelete(id);
      setDeleteRecord(undefined);
    },
  });

  const deleteDialog = deleteRecord ? (
    <DeleteEmploymentDialog
      job={deleteRecord}
      {...deleteValidation}
      open={showDelete}
      onClose={() => {
        setShowDelete(false);
      }}
    />
  ) : null;

  return (
    <CollapsibleSection title="Employment" show={props.show}>
      <EmploymentInnerPanel
        employment={employment}
        onClickAdd={() => {
          setEditRecord(undefined);
          setShowForm(true);
        }}
        onClickEdit={(job) => {
          setEditRecord(job);
          setShowForm(true);
        }}
        onClickDelete={(job) => {
          setDeleteRecord(job);
          setShowDelete(true);
        }}
      />
      {saveDialog}
      {deleteDialog}
    </CollapsibleSection>
  );
}

function EmploymentInnerPanel(props: {
  employment: Employment[];
  onClickAdd: () => void;
  onClickEdit: (job: Employment) => void;
  onClickDelete: (job: Employment) => void;
}): React.JSX.Element {
  if (props.employment.length === 0) {
    return (
      <EmploymentEmptyState
        onAdd={() => {
          props.onClickAdd();
        }}
      />
    );
  }

  return (
    <div className="flex grow flex-col space-y-8">
      <div className="grow space-y-8">
        <div className="flex items-center gap-4">
          <Text className="max-w-prose">
            List all your previous jobs and internships which may be relevant to your search.
          </Text>
          <div className="hidden grow text-right sm:block">
            <Button plain onClick={props.onClickAdd}>
              <PlusIcon />
              Add
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 ">
          {props.employment.map((job) => (
            <EmploymentItem
              key={job.id}
              job={job}
              onEdit={() => {
                props.onClickEdit(job);
              }}
              onDelete={() => {
                props.onClickDelete(job);
              }}
            />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 shrink sm:hidden">
        <div className="h-full grow bg-green-200">
          <Button color="brand" className="w-full" onClick={props.onClickAdd}>
            <PlusIcon /> Add employment
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmploymentEmptyState({ onAdd }: { onAdd: () => void }): React.JSX.Element {
  return (
    <div className="relative w-full overflow-hidden py-16">
      <div className=" relative z-10 max-w-fit space-y-12">
        <div>
          <H1 className="mb-4  text-balance">Add your work history</H1>
          <p className="max-w-80 text-lg/6 text-zinc-700 ">
            Add as much detail as possible.
            <br />
            Then fine tune individual resumes.
          </p>
        </div>
        <Button color="brand" onClick={onAdd}>
          Add Employment
        </Button>
      </div>
      <div className="absolute left-16 top-1/2 z-0 -translate-y-1/2 lg:left-64">
        <BriefcaseIcon className="h-96 w-96 text-gray-200" />
      </div>
    </div>
  );
}

function EmploymentItem({
  job,
  onEdit,
  onDelete,
}: {
  job: Employment;
  onEdit: () => void;
  onDelete: () => void;
}): React.JSX.Element {
  const [viewing, setViewing] = useState(false);

  if (viewing) {
    return (
      <Card className="col-span-4 space-y-6 p-6">
        <div className="flex w-full items-baseline justify-between text-left">
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-sm font-medium text-gray-900">{job.company}</h3>
              {job.is_current_position ? <Badge color="green">current</Badge> : null}
            </div>
            <p className="mt-1 truncate text-sm text-gray-500">{job.title}</p>
            <p className="mt-2 truncate text-sm text-gray-400">
              {shorthandDate(job.start_date, job.end_date)}
            </p>
          </div>
          <Button
            onClick={() => {
              setViewing(false);
            }}
            plain
          >
            <XMarkIcon />
          </Button>
        </div>

        {job.description !== '' ? <Text>{job.description}</Text> : null}
        {job.highlights.length > 0 ? (
          <ul className="ml-4 max-w-prose list-disc space-y-4 text-gray-800">
            {job.highlights.map((highlight) => (
              <li key={highlight.id}>{highlight.description}</li>
            ))}
          </ul>
        ) : null}
      </Card>
    );
  }

  return (
    <EntityCard
      className="col-span-4 sm:col-span-2"
      badge={job.is_current_position ? <Badge color="green">current</Badge> : undefined}
      id={job.id}
      title={job.company}
      subTitle={job.title}
      onView={() => {
        setViewing(true);
      }}
      onHide={noop}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <p className="truncate text-sm text-gray-400">
        {shorthandDate(job.start_date, job.end_date)}
      </p>
    </EntityCard>
  );
}

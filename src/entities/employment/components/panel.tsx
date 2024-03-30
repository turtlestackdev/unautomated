import React, { useState } from 'react';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import type { Employment } from '@/entities/employment/types';
import { Strong, Text } from '@/components/text';
import { Button } from '@/components/button';
import { EmploymentFormDialog } from '@/entities/employment/components/form';
import { EntityCard } from '@/components/cards/entity-card';
import { noop, shorthandDate } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { Card } from '@/components/cards/card';
import { employmentSchema } from '@/entities/employment/validation';
import { type DeleteAction, type FormAction } from '@/lib/validation';
import { EntityPanel } from '@/components/entities/entity-panel';
import { DeleteDialog } from '@/components/entities/delete-dialog';

export function EmploymentPanel(props: {
  employment: Employment[];
  saveAction: FormAction<typeof employmentSchema, Employment>;
  deleteAction: DeleteAction;
  show?: boolean;
}): React.JSX.Element {
  return (
    <EntityPanel
      records={props.employment}
      schema={employmentSchema}
      saveAction={props.saveAction}
      deleteAction={props.deleteAction}
      title="Employment"
    >
      {(panelProps) => (
        <>
          {panelProps.isEmpty ? (
            <EntityPanel.EmptySate
              headline="Add your work history"
              onAdd={panelProps.onClickAdd}
              btnText="Add employment"
              Icon={<BriefcaseIcon />}
            >
              Add as much detail as possible.
              <br />
              Then fine tune individual resumes.
            </EntityPanel.EmptySate>
          ) : (
            <EntityPanel.Content
              description="List all your previous jobs and internships which may be relevant to your search."
              onClickAdd={panelProps.onClickAdd}
              addBtnText="Add employment"
            >
              {panelProps.records.map((job) => (
                <EmploymentItem
                  key={job.id}
                  job={job}
                  onEdit={() => {
                    panelProps.onClickEdit(job);
                  }}
                  onDelete={() => {
                    panelProps.onClickDelete(job);
                  }}
                />
              ))}
            </EntityPanel.Content>
          )}
          <EmploymentFormDialog
            employment={panelProps.recordToSave}
            onSubmit={panelProps.submitSave}
            errors={panelProps.saveErrors}
            open={panelProps.isSaveDialogOpen}
            onClose={panelProps.onCloseSaveDialog}
          />
          {/*
            recordToDelete should always be set when the dialog is open.
            Conditional rendering causes the transition to be skipped.
            */}
          <DeleteDialog
            title="Delete employment"
            record={panelProps.recordToDelete ?? { id: '' }}
            open={panelProps.isDeleteDialogOpen}
            onClose={panelProps.onCloseDeleteDialog}
            onSubmit={panelProps.submitDelete}
            errors={panelProps.deleteErrors !== null}
          >
            <Text>Are you sure you want to delete the job:</Text>
            <Strong className="font-semibold">
              {panelProps.recordToDelete?.title} - {panelProps.recordToDelete?.company}
            </Strong>
            <Text>This action cannot be undone.</Text>
          </DeleteDialog>
        </>
      )}
    </EntityPanel>
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

import React, { useState } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Strong, Text } from '@/components/text';
import { Button } from '@/components/button';
import { EntityCard } from '@/components/cards/entity-card';
import { noop, shorthandDate } from '@/lib/utils';
import { Card } from '@/components/cards/card';
import { type DeleteAction, type FormAction } from '@/lib/validation';
import { EntityPanel } from '@/components/entities/entity-panel';
import { DeleteDialog } from '@/components/entities/delete-dialog';
import { type Degree, type Education } from '@/entities/education/types';
import { educationSchema } from '@/entities/education/validation';
import { EducationFormDialog } from '@/entities/education/components/form';

function EducationItem({
  degree,
  onEdit,
  onDelete,
}: {
  degree: Education;
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
              <h3 className="truncate text-sm font-medium text-gray-900">{degree.degree}</h3>
            </div>
            <p className="mt-1 truncate text-sm text-gray-500">{degree.school}</p>
            <p className="mt-2 truncate text-sm text-gray-400">
              {shorthandDate(degree.start_date, degree.end_date)}
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

        {degree.highlights.length > 0 ? (
          <ul className="ml-4 max-w-prose list-disc space-y-4 text-gray-800">
            {degree.highlights.map((highlight) => (
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
      id={degree.id}
      title={degree.degree}
      subTitle={degree.school}
      onView={() => {
        setViewing(true);
      }}
      onHide={noop}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <p className="truncate text-sm text-gray-400">
        {shorthandDate(degree.start_date, degree.end_date)}
      </p>
    </EntityCard>
  );
}

export function EducationPanel(props: {
  education: Education[];
  degrees: Degree[];
  saveAction: FormAction<typeof educationSchema, Education>;
  deleteAction: DeleteAction;
  show?: boolean;
}): React.JSX.Element {
  return (
    <EntityPanel
      records={props.education}
      schema={educationSchema}
      saveAction={props.saveAction}
      deleteAction={props.deleteAction}
      title="Education"
    >
      {(panelProps) => (
        <>
          {panelProps.isEmpty ? (
            <EntityPanel.EmptySate
              headline="Add a degree"
              onAdd={panelProps.onClickAdd}
              btnText="Add education"
              Icon={<AcademicCapIcon />}
            >
              Include information about you higher education.
            </EntityPanel.EmptySate>
          ) : (
            <EntityPanel.Content
              description="List your enrollment in colleges and universities."
              onClickAdd={panelProps.onClickAdd}
              addBtnText="Add education"
            >
              {panelProps.records.map((degree) => (
                <EducationItem
                  key={degree.id}
                  degree={degree}
                  onEdit={() => {
                    panelProps.onClickEdit(degree);
                  }}
                  onDelete={() => {
                    panelProps.onClickDelete(degree);
                  }}
                />
              ))}
            </EntityPanel.Content>
          )}
          <EducationFormDialog
            record={panelProps.recordToSave}
            degrees={props.degrees}
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
            title="Delete education"
            record={panelProps.recordToDelete ?? { id: '' }}
            open={panelProps.isDeleteDialogOpen}
            onClose={panelProps.onCloseDeleteDialog}
            onSubmit={panelProps.submitDelete}
            errors={panelProps.deleteErrors !== null}
          >
            <Text>Are you sure you want to delete the degree:</Text>
            <Strong className="font-semibold">{panelProps.recordToDelete?.degree}</Strong>
            <Text>This action cannot be undone.</Text>
          </DeleteDialog>
        </>
      )}
    </EntityPanel>
  );
}

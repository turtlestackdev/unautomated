import { type Selectable } from 'kysely';
import React, { useState } from 'react';
import type { DeleteAction, FormAction } from '@/lib/validation';
import { type ResumeObjective } from '@/database/schema';
import { objectiveSchema } from '@/entities/objective/validation';
import { EntityPanel } from '@/components/entities/entity-panel';
import { DeleteDialog } from '@/components/entities/delete-dialog';
import { Strong, Text } from '@/components/text';
import Compass from '@/icons/compass.svg';
import { Badge } from '@/components/badge';
import { EntityCard } from '@/components/cards/entity-card';
import { ObjectiveFormDialog } from '@/entities/objective/components/form';

export function ObjectivePanel(props: {
  objectives: Selectable<ResumeObjective>[];
  saveAction: FormAction<typeof objectiveSchema, Selectable<ResumeObjective>>;
  deleteAction: DeleteAction;
  show?: boolean;
}): React.JSX.Element {
  return (
    <EntityPanel
      records={props.objectives}
      schema={objectiveSchema}
      saveAction={props.saveAction}
      deleteAction={props.deleteAction}
      title="Objectives"
    >
      {(panelProps) => (
        <>
          {panelProps.isEmpty ? (
            <EntityPanel.EmptySate
              headline="Add a resume objective"
              onAdd={panelProps.onClickAdd}
              btnText="Add objective"
              Icon={<Compass />}
            >
              Give a summary of who you are and what you&apos;re looking for
            </EntityPanel.EmptySate>
          ) : (
            <EntityPanel.Content
              description="Objectives are introductory paragrapsh about your professional-self."
              onClickAdd={panelProps.onClickAdd}
              addBtnText="Add objective"
            >
              {panelProps.records.map((objective) => (
                <ObjectiveItem
                  key={objective.id}
                  objective={objective}
                  onEdit={() => {
                    panelProps.onClickEdit(objective);
                  }}
                  onDelete={() => {
                    panelProps.onClickDelete(objective);
                  }}
                />
              ))}
            </EntityPanel.Content>
          )}
          <ObjectiveFormDialog
            record={panelProps.recordToSave}
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
            title="Delete objective"
            record={panelProps.recordToDelete ?? { id: '' }}
            open={panelProps.isDeleteDialogOpen}
            onClose={panelProps.onCloseDeleteDialog}
            onSubmit={panelProps.submitDelete}
            errors={panelProps.deleteErrors !== null}
          >
            <Text>Are you sure you want to delete the objective:</Text>
            <Strong className="font-semibold">{panelProps.recordToDelete?.name}</Strong>
            <Text>This action cannot be undone.</Text>
          </DeleteDialog>
        </>
      )}
    </EntityPanel>
  );
}

function ObjectiveItem({
  objective,
  onEdit,
  onDelete,
}: {
  objective: Selectable<ResumeObjective>;
  onEdit: () => void;
  onDelete: () => void;
}): React.JSX.Element {
  const [viewing, setViewing] = useState(false);

  return (
    <EntityCard
      className="col-span-4 sm:col-span-2"
      badge={objective.is_default ? <Badge color="amber">default</Badge> : undefined}
      id={objective.id}
      title={objective.name}
      subTitle={objective.objective}
      onView={() => {
        setViewing(true);
      }}
      expand={viewing}
      onHide={() => {
        setViewing(false);
      }}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

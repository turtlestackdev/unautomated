import React, { useState } from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import type { DeleteAction, FormAction } from '@/lib/validation';
import { EntityPanel } from '@/components/entities/entity-panel';
import { DeleteDialog } from '@/components/entities/delete-dialog';
import { Strong, Text } from '@/components/text';
import { type SkillGroup } from '@/entities/skill/types';
import { skillSchema } from '@/entities/skill/validation';
import { SkillFormDialog } from '@/entities/skill/form';
import { EntityCard } from '@/components/cards/entity-card';

export function SkillPanel(props: {
  skillCategories: SkillGroup[];
  saveAction: FormAction<typeof skillSchema, SkillGroup>;
  deleteAction: DeleteAction;
  show?: boolean;
}): React.JSX.Element {
  return (
    <EntityPanel
      records={props.skillCategories}
      schema={skillSchema}
      saveAction={props.saveAction}
      deleteAction={props.deleteAction}
      title="Skills"
    >
      {(panelProps) => (
        <>
          {panelProps.isEmpty ? (
            <EntityPanel.EmptySate
              headline="Add a skill category"
              onAdd={panelProps.onClickAdd}
              btnText="Add skills"
              Icon={<ArrowTrendingUpIcon />}
            >
              Categorize your skills.
            </EntityPanel.EmptySate>
          ) : (
            <EntityPanel.Content
              description="List your unique skills."
              onClickAdd={panelProps.onClickAdd}
              addBtnText="Add skills"
            >
              {panelProps.records.map((category) => (
                <SkillItem
                  key={category.id}
                  category={category}
                  onEdit={() => {
                    panelProps.onClickEdit(category);
                  }}
                  onDelete={() => {
                    panelProps.onClickDelete(category);
                  }}
                />
              ))}
            </EntityPanel.Content>
          )}
          <SkillFormDialog
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
            title="Delete skill category"
            record={panelProps.recordToDelete ?? { id: '' }}
            open={panelProps.isDeleteDialogOpen}
            onClose={panelProps.onCloseDeleteDialog}
            onSubmit={panelProps.submitDelete}
            errors={panelProps.deleteErrors !== null}
          >
            <Text>Are you sure you want to delete the skill category:</Text>
            <Strong className="font-semibold">{panelProps.recordToDelete?.name}</Strong>
            <Text>This action cannot be undone.</Text>
          </DeleteDialog>
        </>
      )}
    </EntityPanel>
  );
}

function SkillItem({
  category,
  onEdit,
  onDelete,
}: {
  category: SkillGroup;
  onEdit: () => void;
  onDelete: () => void;
}): React.JSX.Element {
  const [viewing, setViewing] = useState(false);

  return (
    <EntityCard
      className="col-span-4 sm:col-span-2"
      id={category.id}
      title={category.name}
      subTitle={`${category.skills.length} skills`}
      onView={() => {
        setViewing(true);
      }}
      onHide={() => {
        setViewing(false);
      }}
      expand={viewing}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

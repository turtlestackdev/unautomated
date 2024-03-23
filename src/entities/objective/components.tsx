import React, { useState } from 'react';
import type { Selectable } from 'kysely';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useSession } from '@/hooks/use-session';
import type { ResumeObjective } from '@/database/schema';
import { deleteObjective, saveObjective } from '@/entities/objective/actions';
import { Button, Submit } from '@/components/button';
import { CollapsibleSection } from '@/components/layout/collapsible-section';
import { TwoColumn } from '@/components/layout/two-column';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog';
import { ListView } from '@/entities/objective/components/list-view';
import { Form } from '@/entities/objective/components/form';

export function ObjectivePanel({
  ...props
}: {
  objectives?: Selectable<ResumeObjective>[];
  show?: boolean;
}): React.JSX.Element {
  const { user } = useSession();
  const [objectives, setObjectives] = useState<Selectable<ResumeObjective>[]>(
    props.objectives ?? []
  );
  const defaultObjective = objectives.find((objective) => objective.is_default);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const onSave = (saved: Selectable<ResumeObjective>): void => {
    setObjectives([
      ...objectives.map((objective) => {
        return { ...objective, is_default: saved.is_default ? false : objective.is_default };
      }),
      saved,
    ]);

    setDialogIsOpen(false);
  };

  const onEdit = (updated: Selectable<ResumeObjective>): void => {
    setObjectives(
      objectives.map((objective) => {
        if (objective.id === updated.id) {
          return updated;
        }

        return { ...objective, is_default: updated.is_default ? false : objective.is_default };
      })
    );

    setDialogIsOpen(false);
  };

  const onDelete = (id: string): void => {
    setObjectives(objectives.filter((objective) => objective.id !== id));
    setDialogIsOpen(false);
  };

  const dialog = (
    <ObjectiveFormDialog
      key={new Date().getTime()}
      objective={{ is_default: defaultObjective === undefined }}
      onSave={onSave}
      open={dialogIsOpen}
      onClose={() => {
        setDialogIsOpen(false);
      }}
    />
  );

  return (
    <>
      {dialog}
      <CollapsibleSection title="Objectives" show={props.show ?? true}>
        <TwoColumn className="relative flex">
          <TwoColumn.Primary className="grow">
            <ListView
              objectives={objectives}
              saveAction={saveObjective.bind(null, user.id)}
              onSave={onEdit}
              deleteAction={deleteObjective.bind(null, user.id)}
              onDelete={onDelete}
            />
          </TwoColumn.Primary>
          <TwoColumn.Secondary className="sticky bottom-0 space-y-8 lg:static lg:grow-0">
            <Button
              color="brand"
              onClick={() => {
                setDialogIsOpen(true);
              }}
              className="w-full lg:w-auto"
            >
              <PlusIcon />
              New Objective
            </Button>
          </TwoColumn.Secondary>
        </TwoColumn>
      </CollapsibleSection>
    </>
  );
}

export function ObjectiveFormDialog({
  objective = {},
  onSave,
  open,
  onClose,
}: {
  objective?: Partial<Selectable<ResumeObjective>>;
  onSave: (objective: Selectable<ResumeObjective>) => void;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const { user } = useSession();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add objective</DialogTitle>
      <DialogBody>
        <Form
          objective={objective}
          action={saveObjective.bind(null, user.id)}
          onSave={(model) => {
            onClose();
            onSave(model);
          }}
          includeActions={false}
          id="new-objective-dialog-form"
        />
        <DialogActions>
          <Button plain onClick={onClose}>
            Cancel
          </Button>
          <Submit color="brand" form="new-objective-dialog-form">
            Save
          </Submit>
        </DialogActions>
      </DialogBody>
    </Dialog>
  );
}

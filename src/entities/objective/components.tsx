import React, { type ReactNode, useState } from 'react';
import type { Selectable } from 'kysely';
import { clsx } from 'clsx';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import type { z } from 'zod';
import { useFormValidation } from '@/hooks/use-form-validation';
import { objectiveSchema } from '@/entities/objective/validation';
import { useSession } from '@/hooks/use-session';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/fieldset';
import { Textarea } from '@/components/textarea';
import { Switch, SwitchField } from '@/components/switch';
import type { ResumeObjective } from '@/database/schema';
import { deleteObjective, saveObjective } from '@/entities/objective/actions';
import { Button, Submit } from '@/components/button';
import { H3, Text } from '@/components/text';
import { CollapsibleSection } from '@/components/layout/collapsible-section';
import { TwoColumn } from '@/components/layout/two-column';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog';
import { Input } from '@/components/input';
import { Badge } from '@/components/badge';

type ObjectiveFormProps = Partial<Selectable<ResumeObjective>> & {
  onSave?: (objective: Selectable<ResumeObjective>) => void;
  className?: string;
};

export function ObjectiveForm({
  onSave,
  className,
  ...objective
}: ObjectiveFormProps): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action, errors } = useFormValidation({
    schema: objectiveSchema,
    action: saveObjective.bind(null, user.id),
    onSuccess: onSave,
  });

  return (
    <form action={action} ref={formRef} className={clsx(className, 'space-y-8')}>
      <span className="text-lg text-zinc-950">
        {objective.id ? 'Edit objective' : 'New objective'}
      </span>
      <ObjectiveFormFields objective={objective} errors={errors?.fieldErrors} />
      <div className="text-right">
        <Submit color="brand">Save</Submit>
      </div>
    </form>
  );
}

export function DeleteObjectiveForm({
  objectiveId,
  onDelete,
  className,
}: {
  objectiveId: string;
  onDelete?: () => void;
  className?: string;
}): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action } = useFormValidation({
    action: deleteObjective.bind(null, user.id, objectiveId),
    onSuccess: () => {
      onDelete && onDelete();
    },
  });

  return (
    <form ref={formRef} action={action} className={className}>
      <Submit title="delete" plain>
        <TrashIcon />
      </Submit>
    </form>
  );
}

export function ObjectivePanel({
  ...props
}: {
  objectives?: Selectable<ResumeObjective>[];
  show?: boolean;
}): React.JSX.Element {
  const [objectives, setObjectives] = useState<Selectable<ResumeObjective>[]>(
    props.objectives ?? []
  );
  const defaultObjective = objectives.find((objective) => objective.is_default);

  const [dialogObjective, setDialogObjective] = useState<Selectable<ResumeObjective> | undefined>(
    undefined
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete' | null>(null);

  const [panelMode, setPanelMode] = useState<'view' | 'edit'>('edit');
  const [panelObjective, setPanelObjective] = useState<Selectable<ResumeObjective> | undefined>(
    undefined
  );

  const onSave = (saved: Selectable<ResumeObjective>): void => {
    setObjectives([
      ...objectives.map((objective) => {
        return { ...objective, is_default: saved.is_default ? false : objective.is_default };
      }),
      saved,
    ]);

    setDialogObjective(undefined);
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

    setDialogObjective(undefined);
    setDialogIsOpen(false);
  };

  const onDelete = (id: string): void => {
    setObjectives(objectives.filter((objective) => objective.id !== id));

    setDialogObjective(undefined);
    setDialogIsOpen(false);
  };

  const closeDialog = (): void => {
    setDialogIsOpen(false);
  };

  const viewDialog = dialogObjective ? (
    <ObjectiveViewDialog
      key={dialogObjective.id}
      objective={dialogObjective}
      open={dialogIsOpen}
      onClose={closeDialog}
    />
  ) : null;

  const editDialog = dialogObjective ? (
    <ObjectiveFormDialog
      key={dialogObjective.id}
      objective={dialogObjective}
      onSuccess={onEdit}
      open={dialogIsOpen}
      onClose={closeDialog}
    />
  ) : (
    <ObjectiveFormDialog
      key={new Date().getTime()}
      objective={{ is_default: defaultObjective === undefined }}
      onSuccess={onSave}
      open={dialogIsOpen}
      onClose={closeDialog}
    />
  );

  const deleteDialog = dialogObjective ? (
    <DeleteObjectiveDialog
      key={dialogObjective.id}
      objective={dialogObjective}
      onSuccess={() => {
        onDelete(dialogObjective.id);
      }}
      open={dialogIsOpen}
      onClose={closeDialog}
    />
  ) : null;

  const getDialog = (): ReactNode => {
    switch (dialogMode) {
      case 'view':
        return viewDialog;
      case 'edit':
        return editDialog;
      case 'delete':
        return deleteDialog;
      default:
        return null;
    }
  };

  const dialog = getDialog();

  const viewPanel = panelObjective ? (
    <ObjectiveViewPanel key={panelObjective.id} objective={panelObjective} />
  ) : null;

  const editPanel = panelObjective ? (
    <ObjectiveForm key={panelObjective.id} {...panelObjective} onSave={onEdit} />
  ) : (
    <ObjectiveForm
      key={new Date().getTime()}
      is_default={defaultObjective === undefined}
      onSave={onSave}
    />
  );

  const getPanel = (): ReactNode => {
    switch (panelMode) {
      case 'view':
        return viewPanel;
      case 'edit':
        return editPanel;
    }
  };

  const panel = getPanel();

  const showAddForm = (): void => {
    setDialogObjective(undefined);
    setDialogMode('edit');
    setDialogIsOpen(true);
  };

  const showObjectiveDialog = (objective: Selectable<ResumeObjective>): void => {
    setDialogObjective(objective);
    setDialogMode('view');
    setDialogIsOpen(true);
  };

  const showObjectivePanel = (objective: Selectable<ResumeObjective>): void => {
    setPanelObjective(objective);
    setPanelMode('view');
  };

  const showEditDialog = (objective: Selectable<ResumeObjective>): void => {
    setDialogObjective(objective);
    setDialogMode('edit');
    setDialogIsOpen(true);
  };

  const showEditPanel = (objective: Selectable<ResumeObjective>): void => {
    setPanelObjective(objective);
    setPanelMode('edit');
  };

  const showDeleteDialog = (objective: Selectable<ResumeObjective>): void => {
    setDialogObjective(objective);
    setDialogMode('delete');
    setDialogIsOpen(true);
  };

  return (
    <CollapsibleSection title="Objectives" show={props.show ?? true}>
      <TwoColumn className="flex grow flex-col">
        <TwoColumn.Primary className="lg:w-1/2">
          {dialog}
          <div className="hidden lg:block">{panel}</div>
          <div className="lg:hidden">
            <Button color="brand" className="w-full" onClick={showAddForm}>
              <PlusIcon /> New Objective
            </Button>
          </div>
        </TwoColumn.Primary>
        <TwoColumn.Secondary className="grow space-y-8  lg:grow-0">
          <div className="text-right">
            <Button color="zinc">
              <PlusIcon />
              New
            </Button>
          </div>
          <ul>
            {objectives.map((objective) => (
              <li key={objective.id} className="flex items-center gap-2">
                <Text className="truncate text-left">{objective.name}</Text>
                {objective.is_default ? <Badge color="amber">default</Badge> : null}
                <div className="flex grow place-content-end text-right">
                  <div className="lg:hidden">
                    <Button
                      plain
                      title="view"
                      onClick={() => {
                        showObjectiveDialog(objective);
                      }}
                    >
                      <EyeIcon />
                    </Button>
                  </div>
                  <div className="hidden lg:block">
                    <Button
                      plain
                      title="view"
                      onClick={() => {
                        showObjectivePanel(objective);
                      }}
                    >
                      <EyeIcon />
                    </Button>
                  </div>
                  <div className="lg:hidden">
                    <Button
                      plain
                      title="edit"
                      onClick={() => {
                        showEditDialog(objective);
                      }}
                    >
                      <PencilSquareIcon />
                    </Button>
                  </div>
                  <div className="hidden lg:block">
                    <Button
                      plain
                      title="edit"
                      onClick={() => {
                        showEditPanel(objective);
                      }}
                    >
                      <PencilSquareIcon />
                    </Button>
                  </div>
                  <div>
                    <Button
                      plain
                      title="delete"
                      onClick={() => {
                        showDeleteDialog(objective);
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TwoColumn.Secondary>
      </TwoColumn>
    </CollapsibleSection>
  );
}

function ObjectiveViewDialog({
  objective,
  open,
  onClose,
}: {
  objective: Selectable<ResumeObjective>;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogBody className="space-y-8">
        <div className="flex items-center gap-2 ">
          <H3>{objective.name}</H3>
          {objective.is_default ? <Badge color="amber">default</Badge> : null}
        </div>
        <div>{objective.objective}</div>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ObjectiveViewPanel({
  objective,
}: {
  objective: Selectable<ResumeObjective>;
}): React.JSX.Element {
  return <div>{objective.name}</div>;
}

function ObjectiveFormFields({
  objective,
  errors,
}: {
  objective?: Partial<Selectable<ResumeObjective>>;
  errors?: z.inferFlattenedErrors<typeof objectiveSchema>['fieldErrors'];
}): React.JSX.Element {
  return (
    <Fieldset>
      {objective?.id ? <input name="id" type="hidden" value={objective.id} /> : null}
      <FieldGroup>
        <Field>
          <Label>Name</Label>
          <Input name="name" defaultValue={objective?.name} errors={errors?.name} />
        </Field>
        <Field>
          <Label>Objective</Label>
          <Textarea
            defaultValue={objective?.objective}
            errors={errors?.objective}
            name="objective"
            rows={8}
          />
        </Field>

        <SwitchField>
          <Label>Default</Label>
          <Description>Make this the default objective in new resumes</Description>
          <Switch defaultChecked={objective?.is_default} name="is_default_objective" />
        </SwitchField>
      </FieldGroup>
    </Fieldset>
  );
}

export function ObjectiveFormDialog({
  objective,
  ...props
}: {
  objective?: Partial<Selectable<ResumeObjective>>;
  onSuccess: (objective: Selectable<ResumeObjective>) => void;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action, submit, errors } = useFormValidation({
    schema: objectiveSchema,
    action: saveObjective.bind(null, user.id),

    onSuccess: (model: Selectable<ResumeObjective>) => {
      props.onSuccess(model);
    },
  });

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form action={action} ref={formRef}>
        <DialogTitle>{objective?.id ? 'Edit objective' : 'New objective'}</DialogTitle>
        <DialogBody>
          <ObjectiveFormFields objective={objective} errors={errors?.fieldErrors} />
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              props.onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              submit();
            }}
            color="brand"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function DeleteObjectiveDialog({
  objective,
  ...props
}: {
  objective: Selectable<ResumeObjective>;
  onSuccess: () => void;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const { user } = useSession();

  const { formRef, action } = useFormValidation({
    action: deleteObjective.bind(null, user.id, objective.id),
    onSuccess: () => {
      props.onSuccess();
    },
  });

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <form action={action} ref={formRef}>
        <DialogTitle>Delete objective</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the objective,{' '}
          <span className="font-semibold">{objective.name}</span>? This action cannot be undone.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={props.onClose}>
            Cancel
          </Button>
          <Submit color="brand">Delete</Submit>
        </DialogActions>
      </form>
    </Dialog>
  );
}

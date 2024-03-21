import React, { type ReactNode, useState } from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import type { Selectable } from 'kysely';
import { clsx } from 'clsx';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useFormValidation } from '@/hooks/use-form-validation';
import { objectiveSchema } from '@/entities/objective/validation';
import { useSession } from '@/hooks/use-session';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/ui/fieldset';
import { Textarea } from '@/ui/textarea';
import { Switch, SwitchField } from '@/ui/switch';
import type { ResumeObjective } from '@/database/schema';
import { deleteObjective, saveObjective } from '@/entities/objective/actions';
import { Button, Submit } from '@/ui/button';
import { EnabledIcon, SaveIcon } from '@/ui/icons/action-icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { H3, Text } from '@/ui/text';
import { CollapsibleSection } from '@/ui/layout/collapsible-section';
import { TwoColumn } from '@/ui/layout/two-column';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Badge } from '@/ui/badge';

type ObjectiveFormProps = Partial<Selectable<ResumeObjective>> & {
  autoSave?: boolean;
  onSave?: (objective: Selectable<ResumeObjective>) => void;
};

export function ObjectiveForm({
  autoSave = false,
  onSave,
  ...objective
}: ObjectiveFormProps): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action, submit, setShouldSubmit, errors } = useFormValidation({
    schema: objectiveSchema,
    action: saveObjective.bind(null, user.id),
    onSuccess: onSave,
  });

  return (
    <form action={action} ref={formRef}>
      {objective.id ? <input name="id" type="hidden" value={objective.id} /> : null}
      <Fieldset>
        <FieldGroup>
          <Field>
            <Label>Objective</Label>
            <Textarea
              defaultValue={objective.objective}
              errors={errors?.fieldErrors.objective}
              name="objective"
              onBlur={(event) => {
                if (autoSave && event.target.value !== objective.objective) {
                  submit();
                }
              }}
              rows={10}
            />
          </Field>
          <div className="flex place-content-end items-center">
            <HeadlessField className="flex place-content-end items-center gap-4">
              <Label>Default</Label>
              <Switch
                defaultChecked={objective.is_default}
                name="is_default_objective"
                onChange={() => {
                  if (autoSave) {
                    setShouldSubmit(true);
                  }
                }}
              />
            </HeadlessField>
            {!autoSave ? (
              <div className="grow text-right">
                <Submit color="brand" title="save">
                  Save
                  <SaveIcon className="h-5 w-5" />
                </Submit>
              </div>
            ) : null}
          </div>
        </FieldGroup>
      </Fieldset>
    </form>
  );
}

export function ObjectiveTable({
  objectives = [],
  onEdit,
  onDelete,
}: {
  objectives?: Selectable<ResumeObjective>[];
  onEdit?: (objective: Selectable<ResumeObjective>) => void;
  onDelete?: (id: string) => void;
}): React.JSX.Element {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Objective</TableHeader>
          <TableHeader>Default</TableHeader>
          <TableHeader>
            <span className="sr-only">Actions</span>
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {objectives.map((objective) => (
          <ObjectiveRow
            key={JSON.stringify(objective)}
            objective={objective}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function ObjectiveRow({
  objective,
  onDelete,
  onEdit,
}: {
  objective: Selectable<ResumeObjective>;
  onEdit?: (objective: Selectable<ResumeObjective>) => void;
  onDelete?: (id: string) => void;
}): React.JSX.Element {
  const { user } = useSession();
  const { formRef, action, errors } = useFormValidation({
    schema: objectiveSchema,
    action: saveObjective.bind(null, user.id),
    onSuccess: (updated: Selectable<ResumeObjective>) => {
      onEdit?.(updated);
    },
  });
  const [editing, setEditing] = useState(false);
  const formId = `resume-objective-editing-${objective.id}`;

  return (
    <TableRow className={editing ? 'align-top' : ''}>
      <TableCell className="w-full">
        <Text className={clsx('max-w-prose truncate', !editing ? '' : 'hidden')}>
          {objective.objective}
        </Text>
        <form action={action} ref={formRef} id={formId} className={clsx(editing ? '' : 'hidden')}>
          <input type="hidden" name="id" value={objective.id} />
          <Field>
            <Label className="sr-only">Objective</Label>
            <Textarea
              defaultValue={objective.objective}
              errors={errors?.fieldErrors.objective}
              name="objective"
              form={formId}
              rows={10}
            />
          </Field>
        </form>
      </TableCell>
      <TableCell>
        <EnabledIcon className={clsx(!editing ? '' : 'hidden')} enabled={objective.is_default} />
        <div className={editing ? ' sm:py-[calc(theme(spacing[1.5])-1px)]' : ''}>
          <Switch
            className={clsx(editing ? '' : 'hidden')}
            defaultChecked={objective.is_default}
            name="is_default_objective"
            form={formId}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Button
            plain
            title="edit"
            className={clsx(!editing ? '' : 'hidden')}
            onClick={() => {
              setEditing(true);
            }}
          >
            <PencilSquareIcon />
          </Button>

          <Button
            plain
            title="save"
            type="submit"
            form={formId}
            className={clsx(editing ? '' : 'hidden')}
          >
            <SaveIcon className="h-4 w-4" data-slot="icon" />
          </Button>

          <Button
            plain
            title="cancel"
            onClick={() => {
              formRef.current?.reset();
              setEditing(false);
            }}
            form={formId}
            className={clsx(editing ? '' : 'hidden')}
          >
            <XMarkIcon />
          </Button>

          <DeleteObjectiveForm
            className={clsx(!editing ? '' : 'hidden')}
            objectiveId={objective.id}
            onDelete={() => {
              onDelete?.(objective.id);
            }}
          />
        </div>
      </TableCell>
    </TableRow>
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

  const onSave = (saved: Selectable<ResumeObjective>): void => {
    setObjectives([
      ...objectives.map((objective) => {
        return { ...objective, is_default: saved.is_default ? false : objective.is_default };
      }),
      saved,
    ]);

    setActiveObjective(undefined);
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

    setActiveObjective(undefined);
    setDialogIsOpen(false);
  };

  const onDelete = (id: string): void => {
    setObjectives(objectives.filter((objective) => objective.id !== id));

    setActiveObjective(undefined);
    setDialogIsOpen(false);
  };

  const [activeObjective, setActiveObjective] = useState<Selectable<ResumeObjective> | undefined>(
    undefined
  );

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete' | null>(null);

  const closeDialog = (): void => {
    setDialogIsOpen(false);
  };

  const viewDialog = activeObjective ? (
    <ObjectiveViewDialog
      key={activeObjective.id}
      objective={activeObjective}
      open={dialogIsOpen}
      onClose={closeDialog}
    />
  ) : null;

  const editDialog = activeObjective ? (
    <ObjectiveFormDialog
      key={activeObjective.id}
      objective={activeObjective}
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

  const deleteDialog = activeObjective ? (
    <DeleteObjectiveDialog
      key={activeObjective.id}
      objective={activeObjective}
      onSuccess={() => {
        onDelete(activeObjective.id);
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

  const showAddForm = (): void => {
    setActiveObjective(undefined);
    setDialogMode('edit');
    setDialogIsOpen(true);
  };

  const showObjectiveDetails = (objective: Selectable<ResumeObjective>): void => {
    setActiveObjective(objective);
    setDialogMode('view');
    setDialogIsOpen(true);
  };

  const showEditForm = (objective: Selectable<ResumeObjective>): void => {
    setActiveObjective(objective);
    setDialogMode('edit');
    setDialogIsOpen(true);
  };

  const showDeleteForm = (objective: Selectable<ResumeObjective>): void => {
    setActiveObjective(objective);
    setDialogMode('delete');
    setDialogIsOpen(true);
  };

  return (
    <CollapsibleSection title="Objectives" show={props.show ?? true}>
      <TwoColumn className="flex grow flex-col ">
        <TwoColumn.Primary>
          <Button color="brand" className="w-full" onClick={showAddForm}>
            <PlusIcon /> New Objective
          </Button>
          {dialog}
        </TwoColumn.Primary>
        <TwoColumn.Secondary className="flex grow flex-col gap-2">
          <ul>
            {objectives.map((objective) => (
              <li key={objective.id} className="flex items-center gap-2">
                <Text className="truncate text-left">{objective.name}</Text>
                {objective.is_default ? <Badge color="amber">default</Badge> : null}
                <span className="grow text-right">
                  <Button
                    plain
                    title="view"
                    onClick={() => {
                      showObjectiveDetails(objective);
                    }}
                  >
                    <EyeIcon />
                  </Button>
                  <Button
                    plain
                    title="edit"
                    onClick={() => {
                      showEditForm(objective);
                    }}
                  >
                    <PencilSquareIcon />
                  </Button>
                  <Button
                    plain
                    title="delete"
                    onClick={() => {
                      showDeleteForm(objective);
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </span>
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
          {objective?.id ? <input name="id" type="hidden" value={objective.id} /> : null}
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input
                  name="name"
                  defaultValue={objective?.name}
                  errors={errors?.fieldErrors.name}
                />
              </Field>
              <Field>
                <Label>Objective</Label>
                <Textarea
                  defaultValue={objective?.objective}
                  errors={errors?.fieldErrors.objective}
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

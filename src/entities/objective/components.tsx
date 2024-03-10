import React, { useState } from 'react';
import { Field as HeadlessField } from '@headlessui/react';
import type { Selectable } from 'kysely';
import { clsx } from 'clsx';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/16/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useFormValidation } from '@/hooks/use-form-validation';
import { objectiveSchema } from '@/entities/objective/validation';
import { useSession } from '@/hooks/use-session';
import { Field, FieldGroup, Fieldset, Label } from '@/ui/fieldset';
import { Textarea } from '@/ui/textarea';
import { Switch } from '@/ui/switch';
import type { ResumeObjective } from '@/database/schema';
import { deleteObjective, saveObjective } from '@/entities/objective/actions';
import { Button, Submit } from '@/ui/button';
import { EnabledIcon, SaveIcon } from '@/ui/icons/action-icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { H3, Text } from '@/ui/text';
import { VisibilityToggle } from '@/ui/actions/visibility-toggle';
import { Collapsible } from '@/ui/transitions/collapsible';

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
  const [formRef, action, submit, setShouldSubmit, errors] = useFormValidation({
    schema: objectiveSchema,
    action: saveObjective.bind(null, user.id),
    onSuccess: onSave,
  });

  return (
    <form action={action} className="max-w-2xl " ref={formRef}>
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
                  <SaveIcon className="h-5 w-5 " />
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
  const [formRef, action, _submit, _setShouldSubmit, errors] = useFormValidation({
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
  const [formRef, action, _submit, _setShouldSubmit, _errors] = useFormValidation({
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
  const [show, setShow] = useState(props.show ?? true);
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
  };

  const onDelete = (id: string): void => {
    setObjectives(objectives.filter((objective) => objective.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center border-b border-gray-200">
        <H3 className="grow">Objectives</H3>
        <div className="flex shrink">
          <VisibilityToggle show={show} onToggle={setShow} />
        </div>
      </div>
      <Collapsible show={show}>
        <div className="space-y-8">
          <ObjectiveForm
            key={`${new Date().getTime()}`}
            is_default={defaultObjective === undefined}
            onSave={onSave}
          />
          {objectives.length > 0 ? (
            <ObjectiveTable objectives={objectives} onEdit={onEdit} onDelete={onDelete} />
          ) : null}
        </div>
      </Collapsible>
    </div>
  );
}

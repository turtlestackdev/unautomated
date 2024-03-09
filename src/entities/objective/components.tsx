import React, { Fragment, useState } from 'react';
import { Field as HeadlessField, Menu, Transition } from '@headlessui/react';
import type { Selectable } from 'kysely';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import { useFormValidation } from '@/hooks/use-form-validation';
import { objectiveSchema } from '@/entities/objective/validation';
import { useSession } from '@/hooks/use-session';
import { Field, FieldGroup, Fieldset, Label } from '@/ui/fieldset';
import { Textarea } from '@/ui/textarea';
import { Switch } from '@/ui/switch';
import type { ResumeObjective } from '@/database/schema';
import { saveObjective } from '@/entities/objective/actions';
import { Submit } from '@/ui/button';
import { EnabledIcon, SaveIcon } from '@/ui/icons/action-icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { H3, Text } from '@/ui/text';
import { VisibilityToggle } from '@/ui/actions/visibility-toggle';
import { Collapsible } from '@/ui/transitions/collapsible';
import { type UnSaved } from '@/lib/utils';

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
                <Submit plain title="save">
                  Save
                  <SaveIcon className="h-5 w-5 fill-brand-400" />
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
}: {
  objectives?: Selectable<ResumeObjective>[];
  onEdit?: (objective: Selectable<ResumeObjective>) => void;
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
          <TableRow key={objective.id}>
            <TableCell>
              <Text className="max-w-prose truncate">{objective.objective}</Text>
            </TableCell>
            <TableCell>
              <EnabledIcon enabled={objective.is_default} />
            </TableCell>
            <TableCell>
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ focus }) => (
                        <button
                          className={clsx(
                            focus ? 'bg-gray-50' : '',
                            'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900'
                          )}
                          type="button"
                          onClick={() => {
                            onEdit && onEdit(objective);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ focus }) => (
                        <button
                          className={clsx(
                            focus ? 'bg-gray-50' : '',
                            'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900'
                          )}
                          type="button"
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
  const [editing, setEditing] = useState<UnSaved<Selectable<ResumeObjective>>>({
    is_default: defaultObjective === undefined,
    objective: '',
  });

  const onSave = (saved: Selectable<ResumeObjective>): void => {
    if (editing.id) {
      setObjectives(
        objectives.map((objective) => {
          if (objective.id === saved.id) {
            return saved;
          }

          return { ...objective, is_default: saved.is_default ? false : objective.is_default };
        })
      );
    } else {
      setObjectives([
        ...objectives.map((objective) => {
          return { ...objective, is_default: saved.is_default ? false : objective.is_default };
        }),
        saved,
      ]);
    }
  };

  const editObjective = (objective: Selectable<ResumeObjective>): void => {
    // todo find a way to tell if the form can be replaced.
    setEditing(objective);
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
        <ObjectiveForm key={editing.id ?? `${new Date().getTime()}`} {...editing} onSave={onSave} />
        <ObjectiveTable objectives={objectives} onEdit={editObjective} />
      </Collapsible>
    </div>
  );
}

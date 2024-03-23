import type { Selectable } from 'kysely';
import React, { useState } from 'react';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import type { ZodType, ZodTypeDef } from 'zod';
import type { ResumeObjective } from '@/database/schema';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import type { FormState } from '@/lib/validation';
import { objectiveSchema } from '@/entities/objective/validation';
import { useFormValidation } from '@/hooks/use-form-validation';
import { Description, Field, FieldGroup, Fieldset, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Switch, SwitchField } from '@/components/switch';
import { DeleteDialog } from '@/entities/objective/components/delete-dialog';

export function ObjectiveCard({
  objective,
  ...props
}: {
  objective: Selectable<ResumeObjective>;
  editAction: (
    prev: FormState<typeof objectiveSchema, Selectable<ResumeObjective>>,
    data: FormData
  ) => Promise<FormState<typeof objectiveSchema, Selectable<ResumeObjective>>>;
  onEdit: (updated: Selectable<ResumeObjective>) => void;
  deleteAction: (
    prev: FormState<ZodType<null, ZodTypeDef, null>, null>,
    data: FormData
  ) => Promise<FormState<ZodType<null, ZodTypeDef, null>, null>>;
  onDelete: () => void;
}): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { action, formRef, errors } = useFormValidation({
    schema: objectiveSchema,
    action: props.editAction,
    onSuccess: props.onEdit,
  });

  return (
    <>
      <div className="flex w-[65ch] items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
        {isEditing ? (
          <form action={action} ref={formRef} className="w-full space-y-8">
            <Fieldset>
              <FieldGroup>
                <Field>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    defaultValue={objective.name}
                    errors={errors?.fieldErrors.name}
                  />
                </Field>
                <Field>
                  <Label>Objective</Label>
                  <Textarea
                    defaultValue={objective.objective}
                    errors={errors?.fieldErrors.objective}
                    name="objective"
                    rows={8}
                  />
                </Field>
                <SwitchField>
                  <Label>Default</Label>
                  <Description>Make this the default objective in new resumes</Description>
                  <Switch defaultChecked={objective.is_default} name="is_default_objective" />
                </SwitchField>
              </FieldGroup>
            </Fieldset>
            <input name="id" type="hidden" value={objective.id} />
            <div className="text-right">
              <Button
                color="brand"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
              {objective.name}
              {objective.is_default ? <Badge color="amber">default</Badge> : null}
              <div className="flex grow place-content-end">
                <Button
                  title="View"
                  plain
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                  }}
                >
                  <EyeIcon />
                </Button>
                <Button
                  plain
                  title="Edit"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  <PencilSquareIcon />
                </Button>
                <Button
                  plain
                  title="delete"
                  onClick={() => {
                    setIsDeleting(true);
                  }}
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
            <p className={clsx(isExpanded ? '' : 'truncate', 'text-sm text-gray-500')}>
              {objective.objective}
            </p>
          </div>
        )}
      </div>
      <DeleteDialog
        objective={objective}
        action={props.deleteAction}
        onSuccess={props.onDelete}
        open={isDeleting}
        onClose={() => {
          setIsDeleting(false);
        }}
      />
    </>
  );
}

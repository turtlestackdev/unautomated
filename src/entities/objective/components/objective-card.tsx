import type { Selectable } from 'kysely';
import React, { useState } from 'react';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import type { ZodType, ZodTypeDef } from 'zod';
import type { ResumeObjective } from '@/database/schema';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import type { FormState } from '@/lib/validation';
import { DeleteDialog } from '@/entities/objective/components/delete-dialog';
import { Form, type FormAction } from '@/entities/objective/components/form';

export function ObjectiveCard({
  objective,
  className,
  ...props
}: {
  objective: Selectable<ResumeObjective>;
  editAction: FormAction;
  onEdit: (updated: Selectable<ResumeObjective>) => void;
  deleteAction: (
    prev: FormState<ZodType<null, ZodTypeDef, null>, null>,
    data: FormData
  ) => Promise<FormState<ZodType<null, ZodTypeDef, null>, null>>;
  onDelete: (id: string) => void;
  className?: string;
}): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <div
        className={clsx(
          className,
          isEditing ? 'row-span-4' : 'row-span-1',
          'max-w-prose place-content-end items-start space-x-3 self-start rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm'
        )}
      >
        {isEditing ? (
          <Form
            objective={objective}
            action={props.editAction}
            onSave={(model) => {
              props.onEdit(model);
              setIsEditing(false);
            }}
            onCancel={() => {
              setIsEditing(false);
            }}
            className="w-full"
          />
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

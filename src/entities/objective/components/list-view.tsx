import { type Selectable } from 'kysely';
import type { ZodType, ZodTypeDef } from 'zod';
import { type ResumeObjective } from '@/database/schema';
import { ObjectiveCard } from '@/entities/objective/components/objective-card';
import type { FormAction } from '@/entities/objective/components/form';
import type { FormState } from '@/lib/validation';

export function ListView({
  objectives,
  saveAction,
  onSave,
  deleteAction,
  onDelete,
}: {
  objectives: Selectable<ResumeObjective>[];
  saveAction: FormAction;
  onSave: (objective: Selectable<ResumeObjective>) => void;
  deleteAction: (
    prev: FormState<ZodType<null, ZodTypeDef, null>, null>,
    data: FormData
  ) => Promise<FormState<ZodType<null, ZodTypeDef, null>, null>>;
  onDelete: () => void;
}): React.JSX.Element {
  return (
    <div className="space-y-4">
      {objectives.map((objective) => (
        <ObjectiveCard
          key={objective.id}
          objective={objective}
          editAction={saveAction}
          onEdit={onSave}
          deleteAction={deleteAction}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

import { type Selectable } from 'kysely';
import { type ResumeObjective } from '@/database/schema';
import { ObjectiveCard } from '@/entities/objective/components/objective-card';
import type { FormAction } from '@/entities/objective/components/form';
import { type DeleteAction } from '@/entities/objective/components/delete-dialog';

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
  deleteAction: DeleteAction;
  onDelete: (id: string) => void;
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

import type { Insertable, Selectable } from 'kysely';
import type { ResumeObjective } from '@/database/schema';
import { db } from '@/database/client';

export async function getUserObjectives(userId: string): Promise<Selectable<ResumeObjective>[]> {
  return db.selectFrom('resume_objectives').selectAll().where('user_id', '=', userId).execute();
}

export async function saveObjective(
  value: Insertable<ResumeObjective>
): Promise<Selectable<ResumeObjective>> {
  const { id, ...data } = value;
  const query =
    id === undefined
      ? db.insertInto('resume_objectives').values(data)
      : db.updateTable('resume_objectives').set(data).where('id', '=', id);

  return query.returningAll().executeTakeFirstOrThrow();
}

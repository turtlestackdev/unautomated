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

  return db.transaction().execute(async (trx) => {
    if (data.is_default) {
      await trx
        .updateTable('resume_objectives')
        .set({ is_default: false })
        .where('user_id', '=', value.user_id)
        .execute();
    }

    const query =
      id === undefined
        ? trx.insertInto('resume_objectives').values(data)
        : trx.updateTable('resume_objectives').set(data).where('id', '=', id);

    return await query.returningAll().executeTakeFirstOrThrow();
  });
}

export async function deleteObjective({
  userId,
  objectiveId,
}: {
  userId: string;
  objectiveId: string;
}): Promise<void> {
  await db
    .deleteFrom('resume_objectives')
    .where('id', '=', objectiveId)
    .where('user_id', '=', userId)
    .execute();
}

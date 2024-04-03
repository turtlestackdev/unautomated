import type { AliasedRawBuilder, ExpressionBuilder, Selectable } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import type { z } from 'zod';
import type { DB, Skill } from '@/database/schema';
import { db } from '@/database/client';
import { type SkillGroup } from '@/entities/skill/types';
import { type skillSchema } from '@/entities/skill/validation';
import { isString } from '@/lib/type-guards';

export async function getUserSkillCategories(userId: string): Promise<SkillGroup[]> {
  return db
    .selectFrom('skill_categories')
    .selectAll('skill_categories')
    .where('skill_categories.user_id', '=', userId)
    .select((eb) => [withSkills(eb)])
    .execute();
}

function withSkills(
  eb: ExpressionBuilder<DB, 'skill_categories'>
): AliasedRawBuilder<Selectable<Skill>[], 'skills'> {
  return jsonArrayFrom(
    eb
      .selectFrom('skills as sk')
      .selectAll('sk')
      .whereRef('sk.category_id', '=', 'skill_categories.id')
      .orderBy('sk.id')
  ).as('skills');
}

export async function saveSkillCategory(
  values: z.infer<typeof skillSchema> & { user_id: string }
): Promise<SkillGroup> {
  const { id, skills, ...data } = values;

  const newSkills = skills.filter((skill) => !isString(skill.id)) as {
    id?: never;
    name: string;
    level: number;
    sort_order: number;
  }[];

  const updatedSkills = skills.filter((skill) => isString(skill.id)) as {
    id: string;
    name: string;
    level: number;
    sort_order: number;
  }[];
  const deleteSkillIds = [...updatedSkills.map((skill) => skill.id)];

  return db.transaction().execute(async (trx) => {
    const query =
      id === undefined
        ? trx.insertInto('skill_categories').values(data)
        : trx.updateTable('skill_categories').set(data).where('id', '=', id);
    const category = await query.returningAll().executeTakeFirstOrThrow();

    let deleteQuery = trx.deleteFrom('skills').where('category_id', '=', category.id);

    if (deleteSkillIds.length > 0) {
      deleteQuery = deleteQuery.where('id', 'not in', deleteSkillIds);
    }
    await deleteQuery.execute();

    let catSkills: Selectable<Skill>[] = (
      await Promise.all(
        updatedSkills.map(
          async (skill) =>
            await trx
              .updateTable('skills')
              .set({
                name: skill.name,
                level: skill.level,
                sort_order: skill.sort_order,
              })
              .where('id', '=', skill.id)
              .where('category_id', '=', category.id)
              .returningAll()
              .execute()
        )
      )
    ).flat();

    if (newSkills.length > 0) {
      catSkills = [
        ...catSkills,
        ...(await trx
          .insertInto('skills')
          .values(
            newSkills.map((skill) => {
              return {
                category_id: category.id,
                name: skill.name,
                level: skill.level,
                sort_order: skill.sort_order,
              };
            })
          )
          .returningAll()
          .execute()),
      ];
    }

    return { ...category, skills: catSkills };
  });
}

export async function deleteSkillCategory({
  userId,
  categoryId,
}: {
  userId: string;
  categoryId: string;
}): Promise<void> {
  await db
    .deleteFrom('skill_categories')
    .where('id', '=', categoryId)
    .where('user_id', '=', userId)
    .execute();
}

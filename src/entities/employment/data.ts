import type { z } from 'zod';
import type { Selectable } from 'kysely';
import { db } from '@/database/client';
import type { JobHighlight } from '@/database/schema';
import type { Employment } from '@/entities/employment/types';
import type { employmentSchema } from '@/entities/employment/validation';

export async function saveJobDetails(
  values: z.infer<typeof employmentSchema> & { user_id: string }
): Promise<Employment> {
  const { id, highlights, ...data } = values;
  return db.transaction().execute(async (trx) => {
    const query =
      id === undefined
        ? trx.insertInto('job_details').values(data)
        : trx.updateTable('job_details').set(data).where('id', '=', id);
    const job = await query.returningAll().executeTakeFirstOrThrow();
    await trx.deleteFrom('job_highlights').where('job_id', '=', job.id).execute();
    let jobHighlights: Selectable<JobHighlight>[] = [];
    if (highlights.length > 0) {
      jobHighlights = await trx
        .insertInto('job_highlights')
        .values(
          highlights.map((highlight) => {
            return {
              job_id: job.id,
              description: highlight,
            };
          })
        )
        .returningAll()
        .execute();
    }

    return { ...job, highlights: jobHighlights };
  });
}

export async function getUserEmployment(userId: string): Promise<Employment[]> {
  const rows = await db
    .selectFrom('job_details as job')
    .leftJoin('job_highlights as h', 'job.id', 'h.job_id')
    .select([
      'job.id',
      'job.title',
      'job.company',
      'job.description',
      'job.start_date',
      'job.end_date',
      'job.is_current_position',
      'h.id as highlightId',
      'h.description as highlight',
    ])
    .where('job.user_id', '=', userId)
    .execute();

  const jobs = new Map<string, Employment>();

  rows.forEach((row) => {
    const { highlightId, highlight, ...jobData } = row;

    const job = jobs.get(jobData.id) ?? { ...jobData, user_id: userId, highlights: [] };
    if (highlightId && highlight) {
      job.highlights.push({ id: highlightId, job_id: job.id, description: highlight });
    }

    jobs.set(job.id, job);
  });
  return [...jobs.values()];
}

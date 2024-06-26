import type { AliasedRawBuilder, ExpressionBuilder, Selectable } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import type { z } from 'zod';
import type { DB, ScholasticHighlight } from '@/database/schema';
import { db } from '@/database/client';
import type { Education, Degree } from '@/entities/education/types';
import type { educationSchema } from '@/entities/education/validation';

export const degreeTypes: Degree[] = [
  { id: 'AA', name: 'Associate of Arts' },
  { id: 'AAA', name: 'Associate of Applied Arts' },
  { id: 'AE', name: 'Associate of Engineering or Associate in Electronics Engineering Technology' },
  { id: 'AS', name: 'Associate of Science' },
  { id: 'AGS', name: 'Associate of General Studies' },
  { id: 'ASN', name: 'Associate of Science in Nursing' },
  { id: 'AF', name: 'Associate of Forestry' },
  { id: 'AT', name: 'Associate of Technology' },
  { id: 'AAB', name: 'Associate of Applied Business' },
  { id: 'AAS', name: 'Associate of Applied Science or Associate of Arts and Sciences' },
  { id: 'AAT', name: 'Associate of Arts in Teaching' },
  { id: 'ABS', name: 'Associate of Baccalaureate Studies' },
  { id: 'ABA', name: 'Associate of Business Administration' },
  { id: 'AES', name: 'Associate of Engineering Science' },
  { id: 'ADN', name: 'Associate Degree in Nursing' },
  { id: 'AET', name: 'Associate in Engineering Technology' },
  { id: 'AFA', name: 'Associate of Fine Arts' },
  { id: 'APE', name: 'Associate of Pre-Engineering' },
  { id: 'AIT', name: 'Associate of Industrial Technology' },
  { id: 'AOS', name: 'Associate of Occupational Studies' },
  { id: 'APT', name: 'Associate in Physical Therapy' },
  { id: 'APS', name: 'Associate of Political Science or Associate of Public Service' },
  { id: 'BAcc', name: 'Bachelor of Accountancy' },
  { id: 'BArch', name: 'Bachelor of Architecture' },
  { id: 'BBA', name: 'Bachelor of Business Administration' },
  { id: 'BComm', name: 'Bachelor of Commerce' },
  { id: 'BCS', name: 'Bachelor of Computer Science' },
  { id: 'BCA', name: 'Bachelor of Computer Application' },
  { id: 'BCL', name: 'Bachelor of Civil Law' },
  { id: 'BDiv', name: 'Bachelor of Divinity' },
  { id: 'BEc', name: 'Bachelor of Economics' },
  { id: 'BEd', name: 'Bachelor of Education' },
  { id: 'BEng', name: 'Bachelor of Engineering' },
  { id: 'BFA', name: 'Bachelor of Fine Arts' },
  { id: 'LLB', name: 'Bachelor of Laws' },
  { id: 'BLitt', name: 'Bachelor of Letters' },
  { id: 'BM', name: 'Bachelor of Music' },
  { id: 'BMS', name: 'Bachelor of Management Studies' },
  { id: 'BPharm', name: 'Bachelor of Pharmacy' },
  { id: 'BPhil', name: 'Bachelor of Philosophy' },
  { id: 'BS', name: 'Bachelor of Science' },
  { id: 'BSN', name: 'Bachelor of Science in Nursing' },
  { id: 'BSW', name: 'Bachelor of Social Work' },
  { id: 'BTech', name: 'Bachelor of Technology' },
  { id: 'BTh', name: 'Bachelor of Theology' },
  { id: 'MBBS', name: 'Bachelor of Medicine' },
  { id: 'STL', name: 'Licentiate in Sacred Theology' },
  { id: 'MJur', name: 'Magister Juris' },
  { id: 'MBA', name: 'Master of Business Administration' },
  { id: 'MCouns', name: 'Master of Counselling' },
  { id: 'MDiv', name: 'Master of Divinity' },
  { id: 'MEd', name: 'Master of Education' },
  { id: 'MEng', name: 'Master of Engineering' },
  { id: 'MFA', name: 'Master of Fine Arts' },
  { id: 'LLM', name: 'Master of Laws' },
  { id: 'MLitt', name: 'Master of Letters' },
  { id: 'MMed', name: 'Master of Medicine' },
  { id: 'MMS', name: 'Master of Management Studies' },
  { id: 'MPhil', name: 'Master of Philosophy' },
  { id: 'MPA', name: 'Master of Public Administration' },
  { id: 'MPH', name: 'Master of Public Health' },
  { id: 'MRes', name: 'Master of Research' },
  { id: 'STM', name: 'Master of Sacred Theology' },
  { id: 'MS', name: 'Master of Science' },
  { id: 'MSN', name: 'Master of Science in Nursing' },
  { id: 'MSW', name: 'Master of Social Work' },
  { id: 'MSt', name: 'Master of Studies' },
  { id: 'ChM', name: 'Master of Surgery' },
  { id: 'Mtech', name: 'Master of Technology' },
  { id: 'PSM', name: 'Professional Science Masters' },
  { id: 'DA', name: 'Doctor of Arts' },
  { id: 'AuD', name: 'Doctor of Audiology' },
  { id: 'DBA', name: 'Doctor of Business Administration' },
  { id: 'JCD', name: 'Doctor of Canon Law' },
  { id: 'DCL', name: 'Doctor of Civil Law' },
  { id: 'DClinPsy', name: 'Doctor of Clinical Psychology' },
  { id: 'DC', name: 'Doctor of Chiropractic' },
  { id: 'DDS', name: 'Doctor of Dental Surgery' },
  { id: 'DDiv', name: 'Doctor of Divinity' },
  { id: 'EdD', name: 'Doctor of Education' },
  { id: 'JSD', name: 'Doctor of Juridical Science' },
  { id: 'DLitt', name: 'Doctor of Letters' },
  { id: 'MD', name: 'Doctor of Medicine' },
  { id: 'DMin', name: 'Doctor of Ministry' },
  { id: 'ND', name: 'Doctor of Naturopathic Medicine' },
  { id: 'DO', name: 'Doctor of Osteopathic Medicine' },
  { id: 'DPharm', name: 'Doctor of Pharmacy' },
  { id: 'PhD', name: 'Doctor of Philosophy' },
  { id: 'PsyD', name: 'Doctor of Psychology' },
  { id: 'DSc', name: 'Doctor of Science' },
  { id: 'ThD', name: 'Doctor of Theology' },
  { id: 'DVM', name: 'Doctor of Veterinary Medicine' },
  { id: 'JD', name: 'Juris Doctor' },
];

export async function getUserEducation(userId: string): Promise<Education[]> {
  return db
    .selectFrom('school_enrollment')
    .selectAll('school_enrollment')
    .where('school_enrollment.user_id', '=', userId)
    .select((eb) => [withHighlights(eb)])
    .execute();
}

function withHighlights(
  eb: ExpressionBuilder<DB, 'school_enrollment'>
): AliasedRawBuilder<Selectable<ScholasticHighlight>[], 'highlights'> {
  return jsonArrayFrom(
    eb
      .selectFrom('scholastic_highlights as h')
      .selectAll('h')
      .whereRef('h.enrollment_id', '=', 'school_enrollment.id')
      .orderBy('h.id')
  ).as('highlights');
}

export async function saveEducation(
  values: z.infer<typeof educationSchema> & { user_id: string }
): Promise<Education> {
  const { id, highlights, ...data } = values;
  return db.transaction().execute(async (trx) => {
    const query =
      id === undefined
        ? trx.insertInto('school_enrollment').values(data)
        : trx.updateTable('school_enrollment').set(data).where('id', '=', id);
    const education = await query.returningAll().executeTakeFirstOrThrow();
    await trx
      .deleteFrom('scholastic_highlights')
      .where('enrollment_id', '=', education.id)
      .execute();
    let eduHighlights: Selectable<ScholasticHighlight>[] = [];
    if (highlights.length > 0) {
      eduHighlights = await trx
        .insertInto('scholastic_highlights')
        .values(
          highlights.map((highlight) => {
            return {
              enrollment_id: education.id,
              description: highlight,
            };
          })
        )
        .returningAll()
        .execute();
    }

    return { ...education, highlights: eduHighlights };
  });
}

export async function deleteEducation({
  userId,
  educationId,
}: {
  userId: string;
  educationId: string;
}): Promise<void> {
  await db
    .deleteFrom('school_enrollment')
    .where('id', '=', educationId)
    .where('user_id', '=', userId)
    .execute();
}

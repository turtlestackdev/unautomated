import type { Selectable } from 'kysely';
import type { ScholasticHighlight, SchoolEnrollment } from '@/database/schema';

export type Education = Selectable<SchoolEnrollment> & {
  highlights: Selectable<ScholasticHighlight>[];
};

export interface Degree {
  id: string;
  name: string;
}

import type { Selectable } from 'kysely';
import type { JobHighlight } from '@/database/schema';

export interface Employment {
  id: string;
  user_id: string;
  company: string;
  title: string;
  start_date: Date | null;
  end_date: Date | null;
  is_current_position: boolean;
  description: string;
  highlights: Selectable<JobHighlight>[];
}

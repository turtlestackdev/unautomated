import type { Selectable } from 'kysely';
import type { Skill, SkillCategory } from '@/database/schema';

export type SkillGroup = Selectable<SkillCategory> & {
  skills: Selectable<Skill>[];
};

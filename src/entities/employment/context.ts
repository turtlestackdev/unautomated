import { createContext, type Dispatch } from 'react';
import { type Employment } from '@/entities/employment/types';

export const EmploymentContext = createContext<Employment[]>([]);
export const EmploymentDispatchContext = createContext<Dispatch<EmploymentAction>>(() => null);

export type EmploymentAction =
  | { type: 'add'; job: Employment }
  | { type: 'edit'; job: Employment }
  | { type: 'delete'; id: string };

export function employmentReducer(
  employment: Employment[],
  action: EmploymentAction
): Employment[] {
  switch (action.type) {
    case 'add': {
      return [...employment, action.job];
    }
    case 'edit': {
      return employment.map((job) => (job.id === action.job.id ? action.job : job));
    }
    case 'delete': {
      return employment.filter((job) => job.id !== action.id);
    }
  }
}

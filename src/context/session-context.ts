import { createContext } from 'react';
import type { Session } from 'lucia';
import type { SessionUser } from '@/lib/auth';

export const SessionContext = createContext<{ session: Session; user: SessionUser } | null>(null);

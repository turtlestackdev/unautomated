'use client';
import { type ReactElement, useReducer } from 'react';
import type { Session } from 'lucia';
import { SessionNav } from '@/ui/layout/session-nav';
import { PageHeader } from '@/ui/layout/page-header';
import {
  NotificationContext,
  NotificationDispatchContext,
  notificationReducer,
  NotificationPanel,
} from '@/ui/notifications/notification';
import type { SessionUser } from '@/lib/auth';
import { SessionContext } from '@/context/session-context';

export interface ApplicationShellProps {
  user: SessionUser;
  session: Session;
  pageName: string;
  children?: React.ReactNode;
}

export function ApplicationShell({
  user,
  session,
  pageName,
  children,
}: ApplicationShellProps): ReactElement {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  return (
    <SessionContext.Provider value={{ session, user }}>
      <NotificationContext.Provider value={notifications}>
        <NotificationDispatchContext.Provider value={dispatch}>
          <div className="min-h-full">
            <SessionNav />
            <PageHeader name={pageName} />
            <main>
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
          <NotificationPanel />
        </NotificationDispatchContext.Provider>
      </NotificationContext.Provider>
    </SessionContext.Provider>
  );
}

'use client';
import { type ReactElement, useReducer } from 'react';
import type { User } from 'lucia';
import { SessionNav } from '@/ui/layout/session-nav';
import { PageHeader } from '@/ui/layout/page-header';
import {
  NotificationContext,
  NotificationDispatchContext,
  notificationReducer,
  NotificationPanel,
} from '@/ui/notifications/notification';

export interface ApplicationShellProps {
  user: User;
  pageName: string;
  children?: React.ReactNode;
}

export function ApplicationShell({
  user,
  pageName,
  children,
}: ApplicationShellProps): ReactElement {
  const [notifications, dispatch] = useReducer(notificationReducer, []);
  return (
    <NotificationContext.Provider value={notifications}>
      <NotificationDispatchContext.Provider value={dispatch}>
        <div className="min-h-full">
          <SessionNav user={user} />
          <PageHeader name={pageName} />
          <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
        <NotificationPanel />
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}

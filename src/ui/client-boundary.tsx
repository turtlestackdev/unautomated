'use client';
import type { Session } from 'lucia';
import { useReducer } from 'react';
import type { SessionUser } from '@/lib/auth';
import {
  NotificationContext,
  NotificationDispatchContext,
  NotificationPanel,
  notificationReducer,
} from '@/ui/notifications/notification';
import { SessionContext } from '@/context/session-context';

export function ClientBoundary({
  session,
  children,
}: React.PropsWithChildren<{
  session?: {
    user: SessionUser;
    session: Session;
  };
}>): React.JSX.Element {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  return (
    <SessionContext.Provider value={session ?? null}>
      <NotificationContext.Provider value={notifications}>
        <NotificationDispatchContext.Provider value={dispatch}>
          {children}
          <NotificationPanel />
        </NotificationDispatchContext.Provider>
      </NotificationContext.Provider>
    </SessionContext.Provider>
  );
}

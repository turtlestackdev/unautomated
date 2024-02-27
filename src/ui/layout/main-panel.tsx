'use client';
import { useReducer, type ReactElement, type ReactNode } from 'react';
import {
  NotificationContext,
  NotificationDispatchContext,
  NotificationPanel,
  notificationReducer,
} from '@/ui/notifications/notification';
import { SessionNav } from '@/ui/layout/session-nav';
import { type SessionUser } from '@/lib/auth';

export interface MainPanelProps {
  user: SessionUser;
  children?: React.ReactNode;
}

export function MainPanel({ user, children }: MainPanelProps): ReactElement {
  const [notifications, dispatch] = useReducer(notificationReducer, []);
  return (
    <NotificationContext.Provider value={notifications}>
      <NotificationDispatchContext.Provider value={dispatch}>
        <div className="min-h-full">
          <SessionNav user={user} />
          {children}
        </div>
        <NotificationPanel />
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}

export function MainPanelHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}): ReactElement {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold leading-6 text-gray-800">{title}</h1>
        <div className="flex grow place-content-end ">{children}</div>
      </div>
    </header>
  );
}

MainPanel.Header = MainPanelHeader;

export function MainPanelContent({ children }: { children?: ReactNode }): ReactElement {
  return (
    <main>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}

MainPanel.Content = MainPanelContent;

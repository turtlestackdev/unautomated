'use client';
import { type ReactElement, type ReactNode, useReducer } from 'react';
import type { Session } from 'lucia';
import { SessionNav } from '@/components/layout/session-nav';
import { PageHeader } from '@/components/layout/page-header';
import {
  NotificationContext,
  NotificationDispatchContext,
  notificationReducer,
  NotificationPanel,
} from '@/components/notifications/notification';
import type { SessionUser } from '@/lib/auth';
import { SessionContext } from '@/context/session-context';
import { ClientBoundary } from '@/components/client-boundary';

export interface ApplicationShellProps {
  user: SessionUser;
  session: Session;
  pageName: string;
  children?: React.ReactNode;
}

export function ApplicationShellOld({
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
            <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
              <aside className="sticky top-8 hidden w-44 shrink-0 lg:block">
                {/* Left column area */}
              </aside>

              <main className="flex-1 border border-dashed border-gray-500">{children}</main>

              <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
                {/* Right column area */}
              </aside>
            </div>
          </div>
          <NotificationPanel />
        </NotificationDispatchContext.Provider>
      </NotificationContext.Provider>
    </SessionContext.Provider>
  );
}

export function AppShell({
  session,
  children,
}: {
  session: {
    user: SessionUser;
    session: Session;
  };
  children?: ReactNode;
}): React.JSX.Element {
  return (
    <ClientBoundary session={session}>
      <div className="flex min-h-full flex-col">
        <SessionNav />
        {children}
      </div>
    </ClientBoundary>
  );
}

export function AppShellHeader({
  title,
  children,
}: React.PropsWithChildren<{
  title: string;
}>): React.JSX.Element {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold leading-6 text-gray-800">{title}</h1>
        <div className="flex grow place-content-end ">{children}</div>
      </div>
    </header>
  );
}

AppShell.Header = AppShellHeader;

export function AppShellContent({ children }: { children?: ReactNode }): ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-7xl grow flex-col items-start gap-x-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
      {children}
    </div>
  );
}

AppShell.Content = AppShellContent;

export function AppShellSideBar({ children }: { children?: ReactNode }): React.JSX.Element {
  return <aside className="sticky top-8 hidden w-44 shrink-0 lg:block">{children}</aside>;
}

AppShell.SideBar = AppShellSideBar;

export function AppShellMain({ children }: { children?: ReactNode }): React.JSX.Element {
  return <main className="flex w-full max-w-full grow flex-col lg:block">{children}</main>;
}

AppShell.Main = AppShellMain;

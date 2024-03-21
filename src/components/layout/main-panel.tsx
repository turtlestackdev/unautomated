'use client';
import { useReducer, type ReactElement, type ReactNode } from 'react';
import {
  NotificationContext,
  NotificationDispatchContext,
  NotificationPanel,
  notificationReducer,
} from '@/components/notifications/notification';
import { SessionNav } from '@/components/layout/session-nav';

export interface MainPanelProps {
  children?: React.ReactNode;
}

export function MainPanel({ children }: MainPanelProps): ReactElement {
  const [notifications, dispatch] = useReducer(notificationReducer, []);
  return (
    <NotificationContext.Provider value={notifications}>
      <NotificationDispatchContext.Provider value={dispatch}>
        <div className="min-h-full">
          <SessionNav />
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
    <>
      {/*<main>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </main>*/}
      <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
}

MainPanel.Content = MainPanelContent;

export function MainPanelLeftColumn({ children }: { children?: ReactNode }): React.JSX.Element {
  return (
    <aside className="sticky top-8 hidden w-44 shrink-0 border border-dashed border-gray-500 lg:block">
      {/* Left column area */}
      {children}
    </aside>
  );
}

MainPanel.LeftColumn = MainPanelLeftColumn;

export function MainPanelMiddleColumn({ children }: { children?: ReactNode }): React.JSX.Element {
  return <main className="flex-1 border border-dashed border-gray-500">{children}</main>;
}

MainPanel.MiddleColumn = MainPanelMiddleColumn;

export function MainPanelRightColumn({ children }: { children?: ReactNode }): React.JSX.Element {
  return (
    <aside className="sticky top-8 hidden w-96 shrink-0 border border-dashed border-gray-500 xl:block">
      {/* Right column area */}
      {children}
    </aside>
  );
}

MainPanel.RightColumn = MainPanelRightColumn;

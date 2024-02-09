import SessionNav from '@/ui/layout/SessionNav';
import PageHeader from '@/ui/layout/PageHeader';
import type { User } from 'lucia';

export interface ApplicationShellProps {
  user: User;
  pageName: string;
  children?: React.ReactNode;
}

export default function ApplicationShell({ user, pageName, children }: ApplicationShellProps) {
  return (
    <>
      <div className="min-h-full">
        <SessionNav user={user} />
        <PageHeader name={pageName} />
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}

import type { ReactElement } from 'react';
import { ApplicationShellOld } from '@/ui/layout/app-shell';
import { validatedSession } from '@/lib/auth';

export default async function Dashboard(): Promise<ReactElement> {
  const { user, session } = await validatedSession();
  return <ApplicationShellOld pageName="Dashboard" session={session} user={user} />;
}

import type { ReactElement } from 'react';
import { ApplicationShell } from '@/ui/layout/application-shell';
import { validatedSession } from '@/lib/auth';

export default async function Dashboard(): Promise<ReactElement> {
  const { user } = await validatedSession();
  return <ApplicationShell pageName="Dashboard" user={user} />;
}

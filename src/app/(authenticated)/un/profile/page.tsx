import type { ReactElement } from 'react';
import { ApplicationShell } from '@/ui/layout/application-shell';
import { validatedSession } from '@/lib/auth';
import { ProfileForm } from '@/app/(authenticated)/un/profile/form';
import * as users from '@/entities/user';

export default async function Dashboard(): Promise<ReactElement> {
  const { user, session } = await validatedSession();
  const links = await users.readLinks({ id: user.id });

  return (
    <ApplicationShell pageName="Profile" session={session} user={user}>
      <ProfileForm links={links} user={user} />
    </ApplicationShell>
  );
}

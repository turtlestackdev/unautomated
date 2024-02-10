import type { ReactElement } from 'react';
import { ApplicationShell } from '@/ui/layout/application-shell';
import { validatedSession } from '@/auth';
import { ProfileForm } from '@/app/(session)/un/profile/form';
import * as users from '@/models/user';

export default async function Dashboard(): Promise<ReactElement> {
  const { user } = await validatedSession();
  const links = await users.readLinks({ id: user.id });

  return (
    <ApplicationShell pageName="Profile" user={user}>
      <ProfileForm links={links} user={user} />
    </ApplicationShell>
  );
}

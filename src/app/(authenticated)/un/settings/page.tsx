import type { ReactElement } from 'react';
import { ApplicationShellOld } from '@/components/layout/app-shell';
import { validatedSession } from '@/lib/auth';
import { ProfileForm } from '@/app/(authenticated)/un/settings/form';
import * as users from '@/entities/user';

export default async function Dashboard(): Promise<ReactElement> {
  const { user, session } = await validatedSession();
  const links = await users.readLinks({ id: user.id });

  return (
    <ApplicationShellOld pageName="Settings" session={session} user={user}>
      <ProfileForm links={links} user={user} />
    </ApplicationShellOld>
  );
}

import ApplicationShell from '@/ui/layout/ApplicationShell';
import { validatedSession, validateRequest } from '@/auth';
import { ProfileForm } from '@/app/(session)/un/profile/form';
import * as users from '@/models/user';

export default async function Dashboard() {
  const { user } = await validatedSession();
  const links = await users.read_links({ id: user.id });

  return (
    <ApplicationShell pageName={'Profile'} user={user}>
      <ProfileForm user={user} links={links} />
    </ApplicationShell>
  );
}

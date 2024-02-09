import ApplicationShell from '@/ui/layout/ApplicationShell';
import { validatedSession, validateRequest } from '@/auth';

export default async function Dashboard() {
  const { user } = await validatedSession();
  return <ApplicationShell pageName={'Dashboard'} user={user} />;
}

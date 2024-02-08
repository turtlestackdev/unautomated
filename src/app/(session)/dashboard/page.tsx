import ApplicationShell from '@/ui/layout/ApplicationShell';
import { validateRequest } from '@/auth';

export default async function Dashboard() {
  const { user } = await validateRequest();
  return <ApplicationShell pageName={'Dashboard'} user={user!} />;
}

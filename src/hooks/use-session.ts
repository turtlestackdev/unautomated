import { useContext } from 'react';
import { redirect, usePathname } from 'next/navigation';
import type { Session } from 'lucia';
import { SessionContext } from '@/context/session-context';
import type { SessionUser } from '@/lib/auth';

export function useSession(): { session: Session; user: SessionUser } {
  const context = useContext(SessionContext);
  const pathname = usePathname();

  if (!context) {
    redirect(`/login?redirect-path=${encodeURIComponent(pathname)}`);
  }

  return context;
}

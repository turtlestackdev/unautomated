import type { ReactElement } from 'react';
import { validatedSession } from '@/auth';
import { Boundary } from '@/app/(session)/un/experience/boundary';

export default async function ResumePage(): Promise<ReactElement> {
  const { user } = await validatedSession();
  return <Boundary user={user} />;
}

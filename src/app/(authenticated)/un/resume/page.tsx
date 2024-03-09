import type { ReactElement } from 'react';
import { validatedSession } from '@/lib/auth';
import { Boundary } from '@/app/(authenticated)/un/resume/boundary';
import * as resumeData from '@/entities/resume-data';

export default async function ResumePage(): Promise<ReactElement> {
  const { user, session } = await validatedSession();
  const resume = await resumeData.readUserData(user.id);
  return <Boundary resumeData={resume} session={session} user={user} />;
}

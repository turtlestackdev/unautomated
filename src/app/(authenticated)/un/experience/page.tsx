import type { ReactElement } from 'react';
import { validatedSession } from '@/lib/auth';
import { Boundary } from '@/app/(authenticated)/un/experience/boundary';
import * as resumeData from '@/models/resume-data';

export default async function ResumePage(): Promise<ReactElement> {
  const { user } = await validatedSession();
  const resume = await resumeData.readUserData(user.id);
  return <Boundary resumeData={resume} user={user} />;
}

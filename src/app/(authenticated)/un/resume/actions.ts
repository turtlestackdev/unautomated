'use server';

import { sleep } from '@/lib/utils';

export async function uploadResume(
  _prev: { status: string },
  data: FormData
): Promise<{ status: string }> {
  //const resume = data.get('resume_file') as File;
  console.log(data);
  await sleep(5);

  return { status: 'done' };
}

import { validateRequest } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { uploadId: string } }) {
  const { session, user } = await validateRequest();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  return NextResponse.json({ user_id: user.id });
}

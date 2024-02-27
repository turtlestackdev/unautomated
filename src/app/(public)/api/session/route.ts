import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function GET(): Promise<Response> {
  const { session, user } = await validateRequest();
  if (!session) {
    return new Response(null, { status: 401 });
  }

  return NextResponse.json({ user_id: user.id });
}

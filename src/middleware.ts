import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyRequestOrigin } from 'lucia';
import { SESSION_COOKIE_NAME, LOCALHOST } from '@/settings';

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  // The Edge runtime does not support various Node functionality and is forced on us for middleware.
  // So, we make an api request to verify the session user id.
  const path = request.nextUrl.pathname;
  if (path.startsWith('/un/')) {
    const auth_cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const response = await fetch(`${LOCALHOST}/api/session`, {
      headers: {
        Cookie: `${SESSION_COOKIE_NAME}=${auth_cookie}`,
      },
    });
    if (response.status >= 400) {
      console.error('NO SESSION', response);
      const redirect = NextResponse.redirect(new URL('/login', request.url));
      redirect.cookies.set({ name: 'redirect-path', value: path });

      return redirect;
    }
  }

  if (request.method === 'GET') {
    return NextResponse.next();
  }
  
  const originHeader = request.headers.get('Origin');
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get('Host');
  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return NextResponse.next();
};

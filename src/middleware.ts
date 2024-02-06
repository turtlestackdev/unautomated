import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyRequestOrigin } from 'lucia';

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  // The Edge runtime does not support various Node functionality and is forced on us for middleware.
  // So, certain middleware functionality, such as checking sessions, live in layout files.
  // Layout files have no direct access to the request object.
  // As a result, we need to dance the do-si-do and set header values to be read from the layout.
  const headers = new Headers(request.headers);
  headers.set('x-request-path', request.nextUrl.pathname);

  if (request.method === 'GET') {
    return NextResponse.next({
      request: {
        headers: headers,
      },
    });
  }
  const originHeader = request.headers.get('Origin');
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get('Host');
  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return new NextResponse(null, {
      status: 403,
      headers: headers,
    });
  }
  return NextResponse.next({
    request: {
      headers: headers,
    },
  });
};

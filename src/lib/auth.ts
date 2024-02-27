import type { Session, User as LuciaUser } from 'lucia';
import { Lucia } from 'lucia';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import type { Selectable } from 'kysely';
import { GitHub } from 'arctic';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { User } from '@/database/schema';
import { pool } from '@/database/client';
import { gravatar } from '@/ui/avatar';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SESSION_COOKIE_NAME } from '@/lib/settings';

const adapter = new NodePostgresAdapter(pool, {
  user: 'users',
  session: 'sessions',
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    name: SESSION_COOKIE_NAME,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      name: attributes.name,
      email: attributes.email,
      github_id: attributes.github_id,
      github_username: attributes.github_username,
      phone: attributes.phone,
      pronouns: attributes.pronouns,
      avatar_id: attributes.avatar_id,
      street_address: attributes.street_address,
      city: attributes.city,
      state: attributes.state,
      postal_code: attributes.postal_code,
      avatar: attributes.avatar_id ? `/uploads/${attributes.avatar_id}` : null,
      initials: attributes.initials ?? null,
    };
  },
});

export type SessionUser = LuciaUser & { avatar: null | string; initials: null | string };

export const validateRequest = cache(
  async (): Promise<{ user: SessionUser; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    let result: { user: SessionUser; session: Session } | { user: null; session: null } =
      await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {
      // next.js throws when you attempt to set cookie when rendering page
    }

    if (result.user) {
      const avatar = result.user.avatar ?? (await gravatar(result.user.email));
      const initials = result.user.name
        ? result.user.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
        : null;

      result = {
        session: { ...result.session },
        user: { ...result.user, avatar, initials },
      };
    }

    return result;
  }
);

// This function will be called from places where the session has already been validated.
// It's just to avoid null checking all over the place.
export async function validatedSession(): Promise<{ user: SessionUser; session: Session }> {
  const { session, user } = await validateRequest();

  if (!session) {
    throw new Error('session is invalid');
  }
  return { session, user };
}

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Selectable<User> & { initials: null | string };
  }
}

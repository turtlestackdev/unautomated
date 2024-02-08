import { db } from '@/database/client';
import type { Selectable, Insertable } from 'kysely';
import type { User } from '@/database/schema';
import { gravatar } from '@/ui/Avatar';

export async function create(
  user: Omit<Insertable<User>, 'id' | 'avatar_id'>
): Promise<Selectable<User>> {
  return await db
    .insertInto('users')
    .values({ ...user, id: crypto.randomUUID() })
    .returningAll()
    .executeTakeFirstOrThrow();
}

type ReadProps =
  | {
      id: string;
      email?: never;
      github_id?: never;
      github_username?: never;
    }
  | {
      id?: never;
      email: string;
      github_id?: never;
      github_username?: never;
    }
  | {
      id?: never;
      email?: never;
      github_id: string;
      github_username?: never;
    }
  | {
      id?: never;
      email?: never;
      github_id?: never;
      github_username: string;
    };

export async function read(props: ReadProps): Promise<Selectable<User> | null> {
  const where = readField(props);
  const users = await db
    .selectFrom('users')
    .selectAll()
    .where(where.field, '=', where.value)
    .execute();

  if (users.length !== 1) {
    return null;
  }

  return users[0];
}

export function readField(props: ReadProps) {
  if (props.id) {
    return { field: 'id', value: props.id } as const;
  }

  if (props.email) {
    return { field: 'email', value: props.email } as const;
  }

  if (props.github_id) {
    return { field: 'github_id', value: props.github_id } as const;
  }

  if (props.github_username) {
    return { field: 'github_username', value: props.github_username } as const;
  }

  throw new Error('unreachable code');
}

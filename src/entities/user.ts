import type { Selectable, Insertable, Updateable } from 'kysely';
import { db } from '@/database/client';
import type { FileUpload, User, UserLink } from '@/database/schema';
import { uploadImage } from '@/entities/file-upload';

export async function create(
  user: Omit<Insertable<User>, 'id' | 'avatar_id'>
): Promise<Selectable<User>> {
  return db
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

export interface UpdateProfileProps {
  user: Omit<Updateable<User>, 'avatar_id'> & { id: string };
  avatar?: File | null;
  links?: Insertable<UserLink>[] | null;
}

export async function updateProfile({ user, avatar, links }: UpdateProfileProps): Promise<{
  user: Selectable<User>;
  avatar: Selectable<FileUpload> | null;
  links: Selectable<UserLink>[] | null;
}> {
  return db.transaction().execute(async (trx) => {
    let insertedAvatar: null | Selectable<FileUpload> = null;
    if (avatar) {
      insertedAvatar = await uploadImage(avatar, user.id, 'user avatar', trx);
    }

    const { id, ...profile } = user;
    const updatedUser = await trx
      .updateTable('users')
      .set(
        insertedAvatar
          ? {
              ...profile,
              avatar_id: insertedAvatar.id,
            }
          : profile
      )
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();

    let upsertedLinks: null | Selectable<UserLink>[] = null;
    if (links) {
      upsertedLinks = await trx
        .insertInto('user_links')
        .values(links)
        .onConflict((oc) =>
          oc.columns(['user_id', 'type']).doUpdateSet({ url: (eb) => eb.ref('excluded.url') })
        )
        .returningAll()
        .execute();
    }

    return { user: updatedUser, avatar: insertedAvatar, links: upsertedLinks };
  });
}

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

  return users[0] ?? null;
}

export function readField(props: ReadProps): {
  field: 'id' | 'email' | 'github_id' | 'github_username';
  value: string;
} {
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

export async function readLinks({
  id,
  types,
}: {
  id: string;
  types?: string | string[];
}): Promise<Record<string, string>> {
  const query = db.selectFrom('user_links').selectAll().where('user_id', '=', id);
  if (types) {
    query.where('type', 'in', types);
  }

  const links: Record<string, string> = {};
  const results = await query.execute();
  results.forEach((link) => (links[link.type] = link.url));

  return links;
}

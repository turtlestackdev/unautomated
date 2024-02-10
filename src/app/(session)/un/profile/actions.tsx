'use server';
import * as users from '@/models/user';
import { FileFormatError, FileSizeError } from '@/errors';
import { type FormState } from '@/app/(session)/un/profile/form';
import { logger } from '@/logger';

export async function updateProfile(
  id: string,
  _prev: FormState,
  data: FormData
): Promise<FormState> {
  const name = data.get('name') as string;
  const phone = data.get('phone') as string;
  const pronouns = data.get('pronouns') as string;
  const streetAddress = data.get('street_address') as string;
  const city = data.get('city') as string;
  const state = data.get('state') as string;
  const postalCode = data.get('postal_code') as string;

  const avatar = data.get('avatar_file') as File;
  const links = [
    { type: 'linked_in', user_id: id, url: data.get('linked_in') as string },
    { type: 'github', user_id: id, url: data.get('github') as string },
    { type: 'personal_site', user_id: id, url: data.get('personal_site') as string },
  ];

  try {
    await users.updateProfile({
      user: {
        id,
        name,
        pronouns,
        phone,
        street_address: streetAddress,
        city,
        state,
        postal_code: postalCode,
      },
      avatar: avatar.size && avatar.type ? avatar : null,
      links,
    });

    return { status: 'success' };
  } catch (error) {
    logger.info({ error }, 'form update failed');

    if (error instanceof FileFormatError) {
      return { status: 'error', errors: { avatar_file: 'file format not supported' } };
    } else if (error instanceof FileSizeError) {
      return { status: 'error', errors: { avatar_file: 'file is too big' } };
    }
    return { status: 'error', message: 'an unknown error occurred' };
  }
}

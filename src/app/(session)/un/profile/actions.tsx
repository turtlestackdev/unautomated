'use server';
import * as users from '@/models/user';

export async function update_profile(id: string, data: FormData) {
  console.log('update_profile called', id, data);
  const name = data.get('name') as string;
  const phone = data.get('phone') as string;
  const pronouns = data.get('pronouns') as string;
  const street_address = data.get('street_address') as string;
  const city = data.get('city') as string;
  const state = data.get('state') as string;
  const postal_code = data.get('postal_code') as string;

  const avatar = data.get('avatar_file') as File;
  const links = [
    { type: 'linked_in', user_id: id, url: data.get('linked_in') as string },
    { type: 'github', user_id: id, url: data.get('github') as string },
    { type: 'personal_site', user_id: id, url: data.get('personal_site') as string },
  ];

  try {
    await users.update_profile({
      user: { id, name, pronouns, phone, street_address, city, state, postal_code },
      avatar: avatar.size && avatar.type ? avatar : null,
      links,
    });

    return 'success';
  } catch (error) {
    console.error(error);
    return 'error';
  }
}

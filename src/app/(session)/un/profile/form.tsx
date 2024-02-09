'use client';
import type { SessionUser } from '@/auth';
import { Text } from '@/ui/Text';
import { Input } from '@/ui/Input';
import { Avatar } from '@/ui/Avatar';
import { Button, FileButton } from '@/ui/Button';
import { Field, FieldGroup, Fieldset, Label, Legend } from '@/ui/Fieldset';
import { GitHubIcon, LinkedInIcon } from '@/ui/icons/SocialIcons';
import { WindowIcon } from '@heroicons/react/20/solid';
import { Select } from '@/ui/Select';
import { US_STATES } from '@/models/locale/state';
import { useState } from 'react';
import { update_profile } from '@/app/(session)/un/profile/actions';
import { useFormStatus } from 'react-dom';

export function ProfileForm({
  user,
  links,
}: {
  user: SessionUser;
  links: { [key: string]: string };
}) {
  const { pending } = useFormStatus();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const previewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const [file] = event.target.files;
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    } else {
      setAvatarUrl(user.avatar);
    }
  };

  return (
    <form action={update_profile.bind(null, user.id)} className={'max-w-lg'}>
      <div className="space-y-12 divide-y divide-gray-300">
        <Fieldset aria-label="Contact information">
          <Legend>Contact Information</Legend>
          <Text>This information will be available for use in resumes and applications.</Text>

          <FieldGroup>
            <Field>
              <Label>Email</Label>
              <Text>{user.email}</Text>
            </Field>

            <Field>
              <Label>Avatar</Label>
              <div className="mt-2 flex items-center gap-x-3">
                <Avatar
                  initials={user.initials}
                  alt={user.name ?? ''}
                  className={'h-12 w-12 bg-brand-500 text-white'}
                  src={avatarUrl}
                />
                <label htmlFor="avatar_file">
                  <FileButton color={'white'}>Change</FileButton>
                  <input
                    id="avatar_file"
                    name="avatar_file"
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className="sr-only"
                    onChange={previewImage}
                  />
                </label>
              </div>
            </Field>
            <Field>
              <Label>Full name</Label>
              <Input
                defaultValue={user.name}
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                placeholder="Jane Smith"
              />
            </Field>

            <Field>
              <Label>Pronouns</Label>
              <Input
                defaultValue={user.pronouns}
                type="text"
                name="pronouns"
                id="pronouns"
                autoComplete="pronouns"
                placeholder="She/Her He/Him They/Them"
              />
            </Field>

            <Field>
              <Label>Phone</Label>
              <Input
                defaultValue={user.phone}
                type="tel"
                name="phone"
                id="phone"
                autoComplete="tel"
                placeholder="(555) 867-5309"
              />
            </Field>
          </FieldGroup>
        </Fieldset>

        <Fieldset className={'pt-12'} aria-label="Contact information">
          <Legend>Social links</Legend>

          <FieldGroup>
            <Field>
              <Label className={'flex items-center gap-1'}>
                <LinkedInIcon className={'inline h-5 w-5 fill-blue-600'} /> LinkedIn
              </Label>
              <Input
                defaultValue={links['linked_in'] ?? ''}
                type="url"
                name="linked_in"
                id="linked_in"
                placeholder="linkedin.com/in/janesmith/"
              />
            </Field>

            <Field>
              <Label className={'flex items-center gap-1'}>
                <GitHubIcon className={'inline h-5 w-5 fill-[#1f2328]'} /> GitHub
              </Label>
              <Input
                defaultValue={links['github'] ?? ''}
                type="url"
                name="github"
                id="github"
                placeholder="github.com/janesmith"
              />
            </Field>

            <Field>
              <Label className={'flex items-center gap-1'}>
                <WindowIcon className={'inline h-5 w-5 fill-brand-500'} /> Personal site
              </Label>
              <Input
                defaultValue={links['personal_site'] ?? ''}
                type="url"
                name="personal_site"
                id="personal_site"
                placeholder="janesmith.com"
              />
            </Field>
          </FieldGroup>
        </Fieldset>

        <Fieldset className={'pt-12'} aria-label="Contact information">
          <Legend>Location</Legend>

          <FieldGroup>
            <Field>
              <Label>Street address</Label>
              <Input
                defaultValue={user.street_address}
                type="text"
                name="street_address"
                id="street_address"
              />
            </Field>

            <Field>
              <Label>City</Label>
              <Input defaultValue={user.city} type="text" name="city" id="city" />
            </Field>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
              <Field className="sm:col-span-2">
                <Label>State</Label>
                <Select name="state" defaultValue={user.state}>
                  <option defaultValue={''}>Select your state</option>
                  {US_STATES.map((state) => (
                    <option defaultValue={state.id} key={state.id}>
                      {state.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Zip code</Label>
                <Input defaultValue={user.postal_code} name="postal_code" size={5} />
              </Field>
            </div>
          </FieldGroup>
        </Fieldset>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="submit" color={'brand'} aria-disabled={pending} disabled={pending}>
          Save
        </Button>
      </div>
    </form>
  );
}

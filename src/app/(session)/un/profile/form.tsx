'use client';
import { WindowIcon } from '@heroicons/react/20/solid';
import type { ReactElement } from 'react';
import { useContext, useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import type { SessionUser } from '@/auth';
import { Text } from '@/ui/text';
import { Input } from '@/ui/input';
import { Avatar } from '@/ui/avatar';
import { FileButton, Submit } from '@/ui/button';
import { ErrorMessage, Field, FieldGroup, Fieldset, Label, Legend } from '@/ui/fieldset';
import { GitHubIcon, LinkedInIcon } from '@/ui/icons/social-icons';
import { Select } from '@/ui/select';
import { US_STATES } from '@/models/locale/state';
import { updateProfile } from '@/app/(session)/un/profile/actions';
import { NotificationDispatchContext } from '@/ui/notifications/notification';

export interface FormState {
  status: 'new' | 'pending' | 'error' | 'success';
  message?: string;
  errors?: Record<string, string>;
}

export function ProfileForm({
  user,
  links,
}: {
  user: SessionUser;
  links: Record<string, string>;
}): ReactElement {
  const action = updateProfile.bind(null, user.id);
  const [state, formAction] = useFormState(action, { status: 'new' });
  const notificationDispatch = useContext(NotificationDispatchContext);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  useEffect(() => {
    if (state.status === 'success') {
      notificationDispatch({
        type: 'add',
        notification: {
          type: 'success',
          title: 'Profile updated',
          details: 'Your profile data has been saved',
        },
      });
    }

    if (state.status === 'error' && state.message) {
      notificationDispatch({
        type: 'add',
        notification: { type: 'error', title: 'Update failed', details: state.message },
      });
    }
  }, [notificationDispatch, state]);

  const previewImage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let url = user.avatar;
    if (event.target.files) {
      const [file] = event.target.files;
      if (file !== undefined) {
        url = URL.createObjectURL(file);
      }
    }

    setAvatarUrl(url);
  };

  return (
    <form action={formAction} className="max-w-lg">
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
                  alt={user.name}
                  className="h-12 w-12 bg-brand-500 text-white"
                  initials={user.initials}
                  src={avatarUrl}
                />
                <label className="flex items-center gap-2" htmlFor="avatar_file">
                  <FileButton color="white">Change</FileButton>
                  {state.errors?.avatar_file ? (
                    <ErrorMessage>{state.errors.avatar_file}</ErrorMessage>
                  ) : null}
                  <input
                    accept="image/png, image/jpeg, image/gif"
                    className="sr-only"
                    id="avatar_file"
                    name="avatar_file"
                    onChange={previewImage}
                    type="file"
                  />
                </label>
              </div>
            </Field>
            <Field>
              <Label>Full name</Label>
              <Input
                autoComplete="name"
                defaultValue={user.name}
                id="name"
                name="name"
                placeholder="Jane Smith"
                type="text"
              />
            </Field>

            <Field>
              <Label>Pronouns</Label>
              <Input
                autoComplete="pronouns"
                defaultValue={user.pronouns}
                id="pronouns"
                name="pronouns"
                placeholder="She/Her He/Him They/Them"
                type="text"
              />
            </Field>

            <Field>
              <Label>Phone</Label>
              <Input
                autoComplete="tel"
                defaultValue={user.phone}
                id="phone"
                name="phone"
                placeholder="(555) 867-5309"
                type="tel"
              />
            </Field>
          </FieldGroup>
        </Fieldset>

        <Fieldset aria-label="Contact information" className="pt-12">
          <Legend>Social links</Legend>

          <FieldGroup>
            <Field>
              <Label className="flex items-center gap-1">
                <LinkedInIcon className="inline h-5 w-5 fill-blue-600" /> LinkedIn
              </Label>
              <Input
                defaultValue={links.linked_in ?? ''}
                id="linked_in"
                name="linked_in"
                placeholder="linkedin.com/in/janesmith/"
                type="url"
              />
            </Field>

            <Field>
              <Label className="flex items-center gap-1">
                <GitHubIcon className="inline h-5 w-5 fill-[#1f2328]" /> GitHub
              </Label>
              <Input
                defaultValue={links.github ?? ''}
                id="github"
                name="github"
                placeholder="github.com/janesmith"
                type="url"
              />
            </Field>

            <Field>
              <Label className="flex items-center gap-1">
                <WindowIcon className="inline h-5 w-5 fill-brand-500" /> Personal site
              </Label>
              <Input
                defaultValue={links.personal_site ?? ''}
                id="personal_site"
                name="personal_site"
                placeholder="janesmith.com"
                type="url"
              />
            </Field>
          </FieldGroup>
        </Fieldset>

        <Fieldset aria-label="Contact information" className="pt-12">
          <Legend>Location</Legend>

          <FieldGroup>
            <Field>
              <Label>Street address</Label>
              <Input
                defaultValue={user.street_address}
                id="street_address"
                name="street_address"
                type="text"
              />
            </Field>

            <Field>
              <Label>City</Label>
              <Input defaultValue={user.city} id="city" name="city" type="text" />
            </Field>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
              <Field className="sm:col-span-2">
                <Label>State</Label>
                <Select defaultValue={user.state} name="state">
                  <option defaultValue="">Select your state</option>
                  {US_STATES.map((usState) => (
                    <option defaultValue={usState.id} key={usState.id}>
                      {usState.name}
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
        <Submit color="brand">Save</Submit>
      </div>
    </form>
  );
}

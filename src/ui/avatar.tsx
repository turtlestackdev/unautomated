import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
} from '@headlessui/react';
import { clsx } from 'clsx';
import React, { forwardRef, type ReactElement } from 'react';
import { UserIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { TouchTarget } from '@/ui/button';
import { Link } from '@/ui/link';

interface AvatarProps {
  src?: string | null;
  square?: boolean;
  initials?: string | null;
  alt?: string;
  className?: string;
}

export function Avatar({
  src = null,
  square = false,
  initials = null,
  alt = '',
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<'span'>): ReactElement {
  return (
    <span
      className={clsx(
        className,

        // Basic layout
        'inline-grid align-middle *:col-start-1 *:row-start-1',

        // Add the correct border radius
        square ? 'rounded-[20%] *:rounded-[20%]' : 'rounded-full *:rounded-full'
      )}
      data-slot="avatar"
      {...props}
    >
      {initials ? (
        <svg
          aria-hidden={alt ? undefined : 'true'}
          className="select-none fill-current text-[48px] font-medium uppercase"
          viewBox="0 0 100 100"
        >
          {alt ? <title>{alt}</title> : null}
          <text
            alignmentBaseline="middle"
            dominantBaseline="middle"
            dy=".125em"
            textAnchor="middle"
            x="50%"
            y="50%"
          >
            {initials}
          </text>
        </svg>
      ) : null}
      {src ? (
        <Image alt={alt} className="aspect-square object-cover" height={96} src={src} width={96} />
      ) : null}
      {!initials && !src && <UserIcon />}
      {/* Add an inset border that sits on top of the image */}
      <span
        aria-hidden="true"
        className="ring-1 ring-inset ring-black/5 dark:ring-white/5 forced-colors:outline"
      />
    </span>
  );
}

export const AvatarButton = forwardRef(function AvatarButton(
  {
    src,
    square = false,
    initials,
    alt,
    className,
    ...props
  }: AvatarProps & (HeadlessButtonProps | React.ComponentPropsWithoutRef<typeof Link>),
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,

    square ? 'rounded-lg' : 'rounded-full',
    'relative focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500'
  );

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>
        <Avatar alt={alt} className="h-full w-full" initials={initials} square={square} src={src} />
      </TouchTarget>
    </Link>
  ) : (
    <HeadlessButton {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar alt={alt} className="h-full w-full" initials={initials} square={square} src={src} />
      </TouchTarget>
    </HeadlessButton>
  );
});

export async function gravatar(email: string): Promise<string | null> {
  const hash = await sha256(email.trim().toLowerCase());
  const url = `https://gravatar.com/avatar/${hash}`;
  const response = await fetch(`${url}?d=404`);
  if (response.status === 404) {
    return null;
  }

  return url;
}

async function sha256(message: string): Promise<string> {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

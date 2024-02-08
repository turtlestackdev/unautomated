import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
} from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';
import { TouchTarget } from '@/ui/Button';
import { Link } from '@/ui/Link';
import { UserIcon } from '@heroicons/react/20/solid';
import { createHash } from 'crypto';

type AvatarProps = {
  src?: string | null;
  square?: boolean;
  initials?: string | null;
  alt?: string;
  className?: string;
};

export function Avatar({
  src = null,
  square = false,
  initials = null,
  alt = '',
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="avatar"
      className={clsx(
        className,

        // Basic layout
        'inline-grid align-middle *:col-start-1 *:row-start-1',

        // Add the correct border radius
        square ? 'rounded-[20%] *:rounded-[20%]' : 'rounded-full *:rounded-full'
      )}
      {...props}
    >
      {initials && (
        <svg
          className="select-none fill-current text-[48px] font-medium uppercase"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text
            x="50%"
            y="50%"
            alignmentBaseline="middle"
            dominantBaseline="middle"
            textAnchor="middle"
            dy=".125em"
          >
            {initials}
          </text>
        </svg>
      )}
      {src && <img src={src} alt={alt} />}
      {!initials && !src && <UserIcon />}
      {/* Add an inset border that sits on top of the image */}
      <span
        className="ring-1 ring-inset ring-black/5 dark:ring-white/5 forced-colors:outline"
        aria-hidden="true"
      />
    </span>
  );
}

export const AvatarButton = React.forwardRef(function AvatarButton(
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
  let classes = clsx(
    className,

    square ? 'rounded-lg' : 'rounded-full',
    'relative focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500'
  );

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>
        <Avatar
          src={src}
          square={square}
          initials={initials}
          alt={alt}
          className={'h-full w-full'}
        />
      </TouchTarget>
    </Link>
  ) : (
    <HeadlessButton {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar
          src={src}
          square={square}
          initials={initials}
          alt={alt}
          className={'h-full w-full'}
        />
      </TouchTarget>
    </HeadlessButton>
  );
});

export async function gravatar(email: string) {
  const hash = createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
  const url = `https://gravatar.com/avatar/${hash}`;
  const response = await fetch(`${url}?d=404`);
  if (response.status === 404) {
    return null;
  }
  
  return url;
}

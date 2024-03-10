import type { ReactElement } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

export function EnabledIcon({
  enabled,
  className,
  ...props
}: {
  enabled: boolean;
} & React.ComponentPropsWithoutRef<'svg'>): ReactElement {
  return enabled ? (
    <CheckCircleIcon
      aria-hidden
      className={clsx(className, 'h-6 w-6 fill-green-300 text-green-700')}
      {...props}
    />
  ) : (
    <XCircleIcon
      aria-hidden
      className={clsx(className, 'h-6 w-6 fill-red-300 text-red-700')}
      {...props}
    />
  );
}

export function SaveIcon(props: React.ComponentPropsWithoutRef<'svg'>): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

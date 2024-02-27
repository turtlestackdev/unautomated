import type { ReactElement } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export function EnabledIcon({ enabled }: { enabled: boolean }): ReactElement {
  return enabled ? (
    <CheckCircleIcon aria-hidden className="h-6 w-6 fill-green-300 text-green-700" />
  ) : (
    <XCircleIcon aria-hidden className="h-6 w-6 fill-red-300 text-red-700" />
  );
}

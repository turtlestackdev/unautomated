import type { ReactElement } from 'react';
import { clsx } from 'clsx';

export function LoadingIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>): ReactElement {
  return (
    <div
      aria-label="loading"
      className={clsx(className, 'loader mx-auto')}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

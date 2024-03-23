import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export function TwoColumn({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}): React.JSX.Element {
  return (
    <div className={clsx(className, 'mx-auto w-full max-w-7xl grow lg:flex')}>
      <div className="flex flex-1 flex-col-reverse gap-4 lg:flex-row">{children}</div>
    </div>
  );
}

export function PrimaryColumn({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}): React.JSX.Element {
  return <div className={clsx(className, '')}>{children}</div>;
}

TwoColumn.Primary = PrimaryColumn;

export function SecondaryColumn({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={clsx(
        className,
        'border-gray-300 xl:flex-1 xl:shrink-0 xl:border-b-0 xl:border-l xl:pl-4'
      )}
    >
      {children}
    </div>
  );
}

TwoColumn.Secondary = SecondaryColumn;

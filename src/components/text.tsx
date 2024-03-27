import { clsx } from 'clsx';
import type { ReactElement } from 'react';
import { Link } from '@/components/link';

export function Text({ className, ...props }: React.ComponentPropsWithoutRef<'p'>): ReactElement {
  return (
    <p
      {...props}
      className={clsx(className, 'text-base/6 text-zinc-700 sm:text-sm/6 dark:text-zinc-400')}
      data-slot="text"
    />
  );
}

export function TextLink({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>): ReactElement {
  return (
    <Link
      {...props}
      className={clsx(
        className,
        'text-zinc-950 underline decoration-zinc-950/50 data-[hover]:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white'
      )}
    />
  );
}

export function Strong({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'strong'>): ReactElement {
  return (
    <strong {...props} className={clsx(className, 'font-medium text-zinc-950 dark:text-white')} />
  );
}

export function Code({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'code'>): ReactElement {
  return (
    <code
      {...props}
      className={clsx(
        className,
        'rounded border border-zinc-950/10 bg-zinc-950/[2.5%] px-0.5 text-sm font-medium text-zinc-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white'
      )}
    />
  );
}

export function H1({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'h1'>): ReactElement {
  return (
    <h2
      {...props}
      className={clsx(
        className,
        'text-3xl font-semibold text-gray-800 sm:text-4xl dark:text-white'
      )}
    >
      {children}
    </h2>
  );
}

export function H2({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'h2'>): ReactElement {
  return (
    <h2
      {...props}
      className={clsx(className, 'text-2xl font-semibold text-gray-800 dark:text-white')}
    >
      {children}
    </h2>
  );
}

export function H3({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'h3'>): ReactElement {
  return (
    <h3
      {...props}
      className={clsx(className, 'text-xl font-semibold text-gray-800 dark:text-white')}
    >
      {children}
    </h3>
  );
}

import {
  Description as HeadlessDescription,
  Field as HeadlessField,
  Fieldset as HeadlessFieldset,
  Label as HeadlessLabel,
  Legend as HeadlessLegend,
  type DescriptionProps as HeadlessDescriptionProps,
  type FieldProps as HeadlessFieldProps,
  type FieldsetProps as HeadlessFieldsetProps,
  type LabelProps as HeadlessLabelProps,
  type LegendProps as HeadlessLegendProps,
} from '@headlessui/react';
import { clsx } from 'clsx';
import React, { type ReactElement } from 'react';
import { isString } from '@/type-guards';

export function Fieldset({
  className,
  ...props
}: { disabled?: boolean } & HeadlessFieldsetProps): ReactElement {
  return (
    <HeadlessFieldset
      {...props}
      className={clsx(className, '[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1')}
    />
  );
}

export function Legend({ className, ...props }: HeadlessLegendProps): ReactElement {
  // linter complains about className being any
  const classes = isString(className) ? className : '';
  return (
    <HeadlessLegend
      {...props}
      className={clsx(
        classes,
        'text-base/6 font-semibold text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white'
      )}
      data-slot="legend"
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>): ReactElement {
  return <div {...props} className={clsx(className, 'space-y-8')} data-slot="control" />;
}

export function Field({ className, ...props }: HeadlessFieldProps): ReactElement {
  return (
    <HeadlessField
      className={clsx(
        className,
        '[&>[data-slot=label]+[data-slot=control]]:mt-3',
        '[&>[data-slot=label]+[data-slot=description]]:mt-1',
        '[&>[data-slot=description]+[data-slot=control]]:mt-3',
        '[&>[data-slot=control]+[data-slot=description]]:mt-3',
        '[&>[data-slot=control]+[data-slot=error]]:mt-3',
        '[&>[data-slot=label]]:font-medium'
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: { className?: string } & HeadlessLabelProps): ReactElement {
  return (
    <HeadlessLabel
      {...props}
      className={clsx(
        className,
        'select-none text-base/6 text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white'
      )}
      data-slot="label"
    />
  );
}

export function Description({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps): ReactElement {
  return (
    <HeadlessDescription
      {...props}
      aria-disabled={disabled}
      className={clsx(
        className,
        'text-base/6 text-zinc-500 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-zinc-400'
      )}
      data-slot="description"
    />
  );
}

export function ErrorMessage({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps): ReactElement {
  return (
    <HeadlessDescription
      {...props}
      aria-disabled={disabled}
      className={clsx(
        className,
        'text-base/6 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500'
      )}
      data-slot="error"
    />
  );
}

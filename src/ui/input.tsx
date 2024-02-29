import { Input as HeadlessInput, type InputProps as HeadlessInputProps } from '@headlessui/react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { ErrorMessage } from '@/ui/fieldset';

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week'] as const;
type DateType = (typeof dateTypes)[number];

export const Input = forwardRef<
  HTMLInputElement,
  {
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType;
    head?: ReactNode;
    tail?: ReactNode;
    errors?: string[];
    showErrors?: boolean;
    multiColumn?: boolean;
  } & HeadlessInputProps
>(function Input(
  { className, head, tail, errors, showErrors = true, multiColumn = false, invalid = [], ...props },
  ref
) {
  const inputInvalid = errors !== undefined ? errors.length > 0 : invalid === true;

  let errorMessages: ReactNode = null;
  if (showErrors && errors?.length && errors.length > 0) {
    if (multiColumn) {
      // when inputs are displayed on the same line, the error message throws the centering off
      // this removes the space issue, but if there are multiple errors the next form row may be obscured.
      errorMessages = (
        <span className="absolute mt-1.5">
          {errors.map((error) => (
            <ErrorMessage className=" mb-1.5" key={error}>
              {error}
            </ErrorMessage>
          ))}
        </span>
      );
    } else {
      errorMessages = errors.map((error) => <ErrorMessage key={error}>{error}</ErrorMessage>);
    }
  }

  return (
    <>
      <span
        className={clsx([
          className,

          // Basic layout
          'relative block w-full',

          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          'before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',

          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          'dark:before:hidden',

          // Focus ring
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-brand-500',

          // Disabled state
          'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',

          // Invalid state
          'before:has-[[data-invalid]]:shadow-red-500/10',
        ])}
        data-slot="control"
      >
        {head ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{head}</span>
          </span>
        ) : null}
        <HeadlessInput
          className={clsx([
            // Date classes
            props.type &&
              (dateTypes as readonly string[]).includes(props.type) && [
                '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
                '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
                '[&::-webkit-datetime-edit]:inline-flex',
                '[&::-webkit-datetime-edit]:p-0',
                '[&::-webkit-datetime-edit-year-field]:p-0',
                '[&::-webkit-datetime-edit-month-field]:p-0',
                '[&::-webkit-datetime-edit-day-field]:p-0',
                '[&::-webkit-datetime-edit-hour-field]:p-0',
                '[&::-webkit-datetime-edit-minute-field]:p-0',
                '[&::-webkit-datetime-edit-second-field]:p-0',
                '[&::-webkit-datetime-edit-millisecond-field]:p-0',
                '[&::-webkit-datetime-edit-meridiem-field]:p-0',
              ],

            // todo find a way to make this more flexible
            head ? 'pl-7 sm:pl-7' : '',
            tail ? 'pr-12 sm:pr-12' : '',

            // Basic layout
            'relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',

            // Typography
            'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',

            // Border
            'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',

            // Background color
            'bg-transparent dark:bg-white/5',

            // Hide default focus styles
            'focus:outline-none',

            // Invalid state
            'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-500 data-[invalid]:data-[hover]:dark:border-red-500',

            // Disabled state
            'data-[disabled]:border-zinc-950/20 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]',
          ])}
          invalid={inputInvalid}
          ref={ref}
          {...props}
        />
        {tail ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{tail}</span>
          </div>
        ) : null}
      </span>
      {errorMessages}
    </>
  );
});

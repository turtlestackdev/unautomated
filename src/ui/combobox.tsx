import {
  Combobox as HeadlessCombobox,
  ComboboxInput as HeadlessComboboxInput,
  ComboboxButton as HeadlessComboboxButton,
  ComboboxOptions as HeadlessComboboxOptions,
  ComboboxOption as HeadlessComboboxOption,
} from '@headlessui/react';
import { clsx } from 'clsx';
import type { FC, ChangeEvent, ReactElement } from 'react';
import React, { forwardRef } from 'react';

export interface ComboboxProps<T> {
  options: { id: string; value: T }[];
  onChange: (value: T | null) => void;
  onClick?: () => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  onQueryChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: T;
  displayValue: (value: T | undefined) => string;
  displayDescription?: (value: T | undefined) => string;
  className?: string;
  name?: string;
  allowCustom?: boolean;
}

interface ForwardedComboBox extends FC<ComboboxProps<unknown>> {
  <T>(props: ComboboxProps<T>): ReturnType<FC<ComboboxProps<T>>>;
}

export const Combobox: ForwardedComboBox = forwardRef(function ComboBox<T>(
  props: ComboboxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div data-slot="control" ref={ref}>
      <HeadlessCombobox name={props.name} onChange={props.onChange} value={props.value || null}>
        <div className="relative">
          <div>
            <span
              className={clsx([
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
            >
              <HeadlessComboboxInput
                className={clsx([
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
                displayValue={props.displayValue}
                onChange={props.onQueryChange}
                onClick={props.onClick}
                onFocus={props.onFocus}
                placeholder={props.placeholder}
              />
              <HeadlessComboboxButton
                className={clsx(
                  'absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'
                )}
                onClick={props.onClick}
              >
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    aria-hidden="true"
                    className="size-5 stroke-zinc-500 group-data-[disabled]:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.75 10.75L8 13L10.25 10.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                    <path
                      d="M10.25 5.25L8 3L5.75 5.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                  </svg>
                </span>
              </HeadlessComboboxButton>
            </span>
          </div>
          <HeadlessComboboxOptions
            className={clsx(
              'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
            )}
          >
            <div>
              {props.options.map((option) => (
                <HeadlessComboboxOption
                  className={({ focus }) =>
                    clsx(
                      'group relative cursor-default select-none py-2 pl-3 pr-9',
                      focus ? 'bg-brand-600 text-white' : 'text-gray-900'
                    )
                  }
                  key={option.id}
                  onChange={() => {
                    props.onClick && props.onClick();
                  }}
                  value={option.value}
                >
                  {props.displayDescription ? (
                    <DescriptionOption
                      description={props.displayDescription(option.value)}
                      title={props.displayValue(option.value)}
                    />
                  ) : (
                    props.displayValue(option.value)
                  )}
                </HeadlessComboboxOption>
              ))}
            </div>
          </HeadlessComboboxOptions>
        </div>
      </HeadlessCombobox>
    </div>
  );
});

function DescriptionOption({
  title,
  description,
}: {
  title: string;
  description: string;
}): ReactElement {
  return (
    <div className="ml-4">
      <h3 className="text-base font-semibold leading-6 text-gray-900 group-data-[headlessui-state~=focus]:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-500 group-data-[headlessui-state~=focus]:text-gray-50">
        {description}
      </p>
    </div>
  );
}

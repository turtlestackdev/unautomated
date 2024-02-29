import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { type InputProps as HeadlessInputProps, Popover, Transition } from '@headlessui/react';
import { format } from 'date-fns/fp';
import { Input } from '@/ui/input';
import { Calendar } from '@/ui/calendar';

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
} & Omit<HeadlessInputProps, 'type' | 'onChange' | 'value' | 'defaultValue' | 'min' | 'max'> & {
    errors?: string[];
    showErrors?: boolean;
    multiColumn?: boolean;
  };

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { value, onChange, min, max, name, ...props },
  ref
) {
  return (
    <Popover className="relative" data-slot="control">
      <input name={name} ref={ref} type="hidden" value={value ? format('yyyy-MM-dd', value) : ''} />
      <Popover.Button as="div">
        <Input
          maxLength={10}
          size={7}
          {...props}
          defaultValue={value ? value.toLocaleDateString() : ''}
          tail={
            <button type="button">
              <CalendarIcon className="h-5 w-5 fill-gray-500" />
            </button>
          }
          type="text"
        />
      </Popover.Button>

      <Transition
        enter="ease-out duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute z-10">
          {({ close }) => (
            <div className="rounded-md bg-white p-4 shadow">
              <div>
                <Calendar
                  max={max}
                  min={min}
                  onChange={(update) => {
                    if (onChange) {
                      onChange(update);
                    }
                    close();
                  }}
                  selectedDates={value}
                />
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
});

export function DatePicker2({
  value,
  onChange,
  min,
  max,
  name,
  ...props
}: DatePickerProps): ReactElement {
  const handleChange = (date: Date): void => {
    if (onChange) {
      onChange(date);
    }
  };
  return (
    <Popover className="relative" data-slot="control">
      <input name={name} type="hidden" value={value ? format('yyyy-MM-dd', value) : ''} />
      <Popover.Button as="div">
        <Input
          maxLength={10}
          size={10}
          {...props}
          defaultValue={value ? value.toLocaleDateString() : ''}
          tail={
            <button type="button">
              <CalendarIcon className="h-5 w-5 fill-gray-500" />
            </button>
          }
          type="text"
        />
      </Popover.Button>

      <Transition
        enter="ease-out duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute z-10">
          {({ close }) => (
            <div className="rounded-md bg-white p-4 shadow">
              <div>
                <Calendar
                  max={max}
                  min={min}
                  onChange={(update) => {
                    handleChange(update);
                    close();
                  }}
                  selectedDates={value}
                />
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

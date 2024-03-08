import { forwardRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';
import { type InputProps as HeadlessInputProps, Popover, Transition } from '@headlessui/react';
import { format } from 'date-fns/fp';
import { Input } from '@/ui/input';
import { Calendar } from '@/ui/calendar';
import { useControllable } from '@/hooks/use-controllable';
import { useEvent } from '@/hooks/use-event';

type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
} & Omit<HeadlessInputProps, 'type' | 'onChange' | 'value' | 'defaultValue' | 'min' | 'max'> & {
    errors?: string[];
    showErrors?: boolean;
    multiColumn?: boolean;
  };

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const {
      value: controlledValue,
      defaultValue,
      onChange: controlledOnChange,
      name,
      min,
      max,

      ...theirProps
    } = props;

    const [value = undefined, theirOnChange] = useControllable<Date>(
      controlledValue,
      controlledOnChange,
      defaultValue
    );

    const onChange = useEvent<Date>((newDate) => {
      theirOnChange(newDate);
    });

    return (
      <Popover className="relative" data-slot="control">
        <input
          defaultValue={value ? format('yyyy-MM-dd', value) : undefined}
          name={name}
          ref={ref}
          type="hidden"
        />
        <Popover.Button as="div">
          <Input
            maxLength={10}
            size={7}
            {...theirProps}
            defaultValue={value ? value.toLocaleDateString() : undefined}
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
                      onChange(update);
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
);

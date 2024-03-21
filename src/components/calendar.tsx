import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { isThisMonth, isToday } from 'date-fns';
import {
  eachDayOfInterval,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  formatISOWithOptions,
  isSameDay,
  subMonths,
  addMonths,
} from 'date-fns/fp';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface CalendarProps {
  baseDate?: Date;
  selectedDates?: Date | [Date] | [Date, Date];
  onChange?: (start: Date) => void;
  min?: Date;
  max?: Date;
}

export function Calendar(props: CalendarProps): ReactElement {
  let initialDate = props.baseDate ?? new Date();

  if (props.min && initialDate < props.min) {
    initialDate = props.min;
  }

  if (props.max && initialDate > props.max) {
    initialDate = props.max;
  }

  const [baseDate, setBaseDate] = useState(initialDate);
  const dates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(baseDate)),
    end: endOfWeek(endOfMonth(baseDate)),
  });
  const selectedDates =
    props.selectedDates instanceof Date ? [props.selectedDates] : props.selectedDates ?? [];
  const selectedStartDate = selectedDates[0] ? selectedDates[0] : null;
  const selectedEndDate = selectedDates[1] ? selectedDates[1] : null;

  const isSelected = (day: Date): boolean => {
    const dayOne = selectedDates[0];
    const dayTwo = selectedDates[1];

    if (dayOne && dayTwo) {
      return isWithinInterval({ start: dayOne, end: dayTwo }, day);
    }

    if (dayOne) {
      return isSameDay(dayOne, day);
    }

    return false;
  };

  const isStartDate = (date: Date): boolean => {
    return selectedStartDate !== null && isSameDay(selectedStartDate, date);
  };

  const isEndDate = (date: Date): boolean => {
    return selectedEndDate !== null && isSameDay(selectedEndDate, date);
  };

  const isMinMonth = (date: Date): boolean => {
    return props.min !== undefined && startOfMonth(date) < props.min;
  };

  const isMaxMonth = (date: Date): boolean => {
    return props.max !== undefined && endOfMonth(date) > props.max;
  };

  const isSelectable = (date: Date): boolean => {
    return (
      (props.min === undefined || date >= props.min) &&
      (props.max === undefined || date <= props.max)
    );
  };

  const prev = (): void => {
    const prevMonth = subMonths(1, baseDate);
    setBaseDate(props.min && prevMonth < props.min ? props.min : prevMonth);
  };
  const next = (): void => {
    const nextMonth = addMonths(1, baseDate);
    setBaseDate(props.max && nextMonth > props.max ? props.max : nextMonth);
  };

  return (
    <div className="w-72">
      <div className="text-center">
        <div className="flex items-center text-gray-900">
          {isMinMonth(baseDate) ? (
            <span className="invisible w-6" />
          ) : (
            <button
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-brand-700 hover:text-brand-800"
              onClick={prev}
              type="button"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          )}

          <div className="flex-auto text-sm font-semibold">{format('LLLL yyyy', baseDate)}</div>
          {isMaxMonth(baseDate) ? (
            <span className="invisible w-6" />
          ) : (
            <button
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-brand-700 hover:text-brand-800"
              onClick={next}
              type="button"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-brand-700">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
          {dates.map((day, dayIdx) => (
            <button
              className={clsx(
                'py-1.5 hover:bg-gray-100 focus:z-10 disabled:cursor-not-allowed disabled:bg-gray-50',
                isThisMonth(day) ? 'bg-white' : 'bg-brand-50',
                isSelected(day) || isToday(day) ? 'font-semibold' : '',
                isSelected(day) ? 'text-white' : '',
                !isSelected(day) && isThisMonth(day) && !isToday(day) ? 'text-gray-900' : '',
                !isSelected(day) && !isThisMonth(day) && !isToday(day) ? 'text-gray-400' : '',
                isToday(day) && !isSelected(day) ? 'text-brand-600' : '',
                dayIdx === 0 ? 'rounded-tl-lg' : '',
                dayIdx === 6 ? 'rounded-tr-lg' : '',
                dayIdx === dates.length - 7 ? 'rounded-bl-lg' : '',
                dayIdx === dates.length - 1 ? 'rounded-br-lg' : ''
              )}
              disabled={!isSelectable(day)}
              key={formatISOWithOptions({ representation: 'date' }, day)}
              onClick={() => {
                props.onChange && props.onChange(day);
              }}
              type="button"
            >
              <time
                className={clsx(
                  'mx-auto flex h-7 items-center justify-center ',
                  isSelected(day) ? 'bg-brand-600' : '',
                  isStartDate(day) && selectedEndDate !== null ? 'ml-2 rounded-l-full' : '',
                  isEndDate(day) && selectedStartDate !== null ? 'mr-2 rounded-r-full' : '',
                  selectedEndDate === null || selectedStartDate === null ? 'w-7 rounded-full' : ''
                )}
                dateTime={formatISOWithOptions({ representation: 'date' }, day)}
              >
                {format('d', day)}
              </time>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

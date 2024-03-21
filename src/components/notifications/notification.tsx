import { Fragment, useContext, createContext } from 'react';
import type { ReactElement, Dispatch } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

export const NotificationContext = createContext<NotificationProps[]>([]);
export const NotificationDispatchContext = createContext<Dispatch<NotificationAction>>(() => null);

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationData {
  type: NotificationType;
  title: string;
  details?: string;
}

export interface NotificationProps extends NotificationData {
  id: string;
}

export type NotificationAction =
  | { type: 'add'; notification: NotificationData }
  | { type: 'delete'; id: string };

export function notificationReducer(
  notifications: NotificationProps[],
  action: NotificationAction
): NotificationProps[] {
  switch (action.type) {
    case 'add': {
      const id = crypto.randomUUID();
      return [...notifications, { id, ...action.notification }];
    }
    case 'delete': {
      return notifications.filter((notification) => notification.id !== action.id);
    }
  }
}

const icons = {
  info: <InformationCircleIcon aria-hidden="true" className="h-6 w-6 text-blue-400" />,
  success: <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />,
  warning: <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-orange-400" />,
  error: <ExclamationCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />,
} as const;

export function NotificationPanel(): ReactElement {
  const notifications = useContext(NotificationContext);
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Notification
            details={notification.details}
            id={notification.id}
            key={notification.id}
            title={notification.title}
            type={notification.type}
          />
        ))}
      </div>
    </div>
  );
}

export function Notification(props: NotificationProps): ReactElement {
  const icon = icons[props.type];
  const dispatch = useContext(NotificationDispatchContext);

  return (
    <Transition
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show
    >
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{props.title}</p>
              {props.details ? <p className="mt-1 text-sm text-gray-500">{props.details}</p> : null}
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  dispatch({ type: 'delete', id: props.id });
                }}
                type="button"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

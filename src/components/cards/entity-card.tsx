import { type ReactElement } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import { Card } from '@/components/cards/card';

export type EntityCardProps = React.PropsWithChildren<{
  id: string;
  title: string;
  subTitle: string;
  badge?: ReactElement;
  className?: string;
  onView: () => void;
  onHide: () => void;
  onEdit: () => void;
  onDelete: () => void;
  expand?: boolean;
}>;

export function EntityCard(props: EntityCardProps): React.JSX.Element {
  return (
    <Card className={clsx(props.className, 'divide-y divide-gray-200')}>
      <EntityCardHeading
        title={props.title}
        subTitle={props.subTitle}
        badge={props.badge}
        onView={props.onView}
        expand={props.expand}
      >
        {props.children}
      </EntityCardHeading>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <button
              type="button"
              onClick={props.onEdit}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <PencilSquareIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Edit
            </button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <button
              type="button"
              onClick={props.onDelete}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function EntityCardHeading(
  props: React.PropsWithChildren<{
    title: string;
    subTitle: string;
    badge?: ReactElement;
    onView: () => void;
    expand?: boolean;
  }>
): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={props.onView}
      title="View"
      className="flex w-full items-baseline justify-between space-x-6 p-6 text-left"
    >
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="truncate text-sm font-medium text-gray-900">{props.title}</h3>
          {props.badge ? props.badge : null}
        </div>
        <p className={clsx(props.expand ? '' : 'truncate', 'mt-1 text-sm text-gray-500')}>
          {props.subTitle}
        </p>
      </div>
      {props.children ? <div className="truncate">{props.children}</div> : null}
    </button>
  );
}

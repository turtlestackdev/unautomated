import React, { useState } from 'react';
import { clsx } from 'clsx';
import { H3 } from '@/components/text';
import { ExpandToggle } from '@/components/actions/expand-toggle';

export function CollapsibleSection({
  title,
  children,
  ...props
}: React.PropsWithChildren<{
  title: string;
  show?: boolean;
}>): React.JSX.Element {
  const [show, setShow] = useState(props.show ?? true);
  return (
    <div className={clsx(show ? 'grow' : null, 'flex grow flex-col space-y-8')}>
      <div className="flex items-center border-b border-gray-200">
        <H3 className="grow">{title}</H3>
        <div className="flex shrink">
          <ExpandToggle show={show} onToggle={setShow} />
        </div>
      </div>
      {show ? <div className="flex grow flex-col space-y-8 ">{children}</div> : null}
    </div>
  );
}

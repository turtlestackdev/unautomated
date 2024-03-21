import React, { useState } from 'react';
import { clsx } from 'clsx';
import { H3 } from '@/ui/text';
import { VisibilityToggle } from '@/ui/actions/visibility-toggle';
import { Collapsible } from '@/ui/transitions/collapsible';

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
          <VisibilityToggle show={show} onToggle={setShow} />
        </div>
      </div>
      <Collapsible show={show}>
        <div className="flex grow flex-col space-y-8 ">{children}</div>
      </Collapsible>
    </div>
  );
}

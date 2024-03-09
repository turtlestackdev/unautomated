import React from 'react';
import { Transition } from '@headlessui/react';

export function Collapsible({
  show,
  children,
}: React.PropsWithChildren<{ show?: boolean }>): React.JSX.Element {
  return (
    <div className="overflow-hidden">
      <Transition
        show={show}
        enter="transition duration-150 ease-out"
        enterFrom="-translate-y-full"
        enterTo="translate-y-0"
        leave="transition duration-150 ease-out"
        leaveFrom="translate-y-0"
        leaveTo=" -translate-y-full"
      >
        {children}
      </Transition>
    </div>
  );
}

import React from 'react';
import { Transition } from '@headlessui/react';

export function Collapsible({
  show,
  children,
}: React.PropsWithChildren<{ show?: boolean }>): React.JSX.Element {
  return (
    <Transition
      show={show}
      enter="transition-all duration-150 ease-in"
      enterFrom="scale-y-0 origin-top max-h-0"
      enterTo="scale-y-100 origin-top max-h-screen"
      leave="transition-all duration-150 ease-in"
      leaveFrom="scale-y-100 origin-bottom max-h-fit"
      leaveTo="scale-y-0 origin-bottom max-h-0"
    >
      <div>{children}</div>
    </Transition>
  );
}

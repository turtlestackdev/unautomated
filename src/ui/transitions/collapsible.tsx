import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

export function Collapsible({
  show,
  children,
}: React.PropsWithChildren<{ show?: boolean }>): React.JSX.Element {
  const [className, setClassName] = useState(show ? 'overflow-visible' : 'overflow-hidden');

  return (
    <div className={className}>
      <Transition
        beforeEnter={() => {
          setClassName('overflow-hidden');
        }}
        afterEnter={() => {
          setClassName('overflow-visible');
        }}
        beforeLeave={() => {
          setClassName('overflow-hidden');
        }}
        show={show}
        enter="transition duration-150 ease-in"
        enterFrom="-translate-y-full"
        enterTo="translate-y-0 "
        leave="transition duration-150 ease-in"
        leaveFrom="translate-y-0"
        leaveTo=" -translate-y-full"
        unmount={false}
      >
        {children}
      </Transition>
    </div>
  );
}

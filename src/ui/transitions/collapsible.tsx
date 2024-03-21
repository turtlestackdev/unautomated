import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { clsx } from 'clsx';

export function Collapsible({
  show,
  children,
}: React.PropsWithChildren<{ show?: boolean }>): React.JSX.Element {
  const [className, setClassName] = useState(show ? 'overflow-visible' : '');
  return (
    <Transition
      className="flex grow flex-col"
      show={show}
      beforeEnter={() => {
        setClassName('overflow-hidden');
      }}
      afterEnter={() => {
        setClassName('');
      }}
      beforeLeave={() => {
        setClassName('overflow-hidden');
      }}
      afterLeave={() => {
        setClassName('');
      }}
      enter="transition-all duration-150 ease-in"
      enterFrom="scale-y-0 origin-top max-h-0"
      enterTo="scale-y-100 origin-top max-h-screen"
      leave="transition-all duration-150 ease-in"
      leaveFrom="scale-y-100 origin-top  max-h-screen"
      leaveTo="scale-y-0 origin-top  max-h-0"
    >
      <div className={clsx(className, 'flex grow flex-col')}>
        <Transition
          className="flex grow flex-col"
          show={show}
          enter="transition-all duration-150 ease-in"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transition-all duration-150 ease-in"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          {children}
        </Transition>
      </div>
    </Transition>
  );
}

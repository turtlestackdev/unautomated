import { BellIcon } from '@heroicons/react/24/outline';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import clsx from 'clsx';
import type { SessionUser } from '@/auth';
import { Avatar } from '@/ui/Avatar';

const userNavigation = [
  { name: 'My Profile', href: '/profile' },
  { name: 'Sign out', href: '/logout' },
];

function links(publicFacing: boolean) {
  const pages = [
    { name: 'My Profile', href: '/profile' },
    { name: 'Sign out', href: '/logout' },
  ];

  if (publicFacing) {
    pages.unshift({ name: 'Dashboard', href: '/dashboard' });
  }

  return pages;
}

export function UserMenu({
  user,
  publicFacing = false,
}: {
  user: SessionUser;
  publicFacing?: boolean;
}) {
  return (
    <div className="hidden place-items-center sm:flex">
      <div className="ml-4 flex items-center md:ml-6">
        <Notifications publicFacing={publicFacing} />

        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              <Avatar
                initials={user.initials}
                alt={user.name ?? ''}
                className={'h-8 w-8 bg-brand-500 text-white'}
                src={user.avatar}
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {links(publicFacing).map((item) => (
                <Menu.Item key={item.name}>
                  {({ focus }) => (
                    <a
                      href={item.href}
                      className={clsx(
                        focus ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export function UserMobileMenu({
  user,
  publicFacing = false,
}: {
  user: SessionUser;
  publicFacing?: boolean;
}) {
  return (
    <div className="border-t border-gray-700 pb-3 pt-4">
      <div className="flex items-center px-5">
        <div className="flex-shrink-0">
          <Avatar
            initials={user.initials}
            alt={user.name ?? ''}
            className={'h-8 w-8 bg-brand-500 text-white'}
            src={user.avatar}
          />
        </div>
        <div className="ml-3">
          <div className="text-base font-medium text-white">{user.name}</div>
          <div className="text-sm font-medium text-gray-400">{user.email}</div>
        </div>
        <Notifications mobile={true} publicFacing={publicFacing} />
      </div>
      <div className="mt-3 space-y-1 px-2">
        {links(publicFacing).map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            {item.name}
          </Disclosure.Button>
        ))}
      </div>
    </div>
  );
}

export function Notifications({
  publicFacing = false,
  mobile = false,
}: {
  publicFacing?: boolean;
  mobile?: boolean;
}) {
  const base =
    'relative rounded-full p-1 text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 ';
  const colors = publicFacing
    ? 'bg-white hover:text-gray-500 focus:ring-brand-500'
    : 'bg-gray-800 hover:text-white focus:ring-white focus:ring-offset-gray-800';
  const layout = mobile ? 'ml-auto flex-shrink-0 ' : '';

  return (
    <button type="button" className={clsx(base, colors, layout)}>
      <span className="absolute -inset-1.5" />
      <span className="sr-only">View notifications</span>
      <BellIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}

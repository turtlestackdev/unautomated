'use client';
import { clsx } from 'clsx';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ReactElement } from 'react';
import { usePathname } from 'next/navigation';
import { UserMenu, UserMobileMenu } from '@/components/layout/user-menu';
import { Logo } from '@/components/branding/logo';
import { Link } from '@/components/link';
import { useSession } from '@/hooks/use-session';

const navigation = [
  { name: 'Dashboard', href: '/un/dashboard' },
  { name: 'Employment Profile', href: '/un/profile' },
  { name: 'Lead Tracker', href: '/un/leads' },
];

export function SessionNav(): ReactElement {
  const { user } = useSession();
  const pathname = usePathname();
  const isCurrent = (href: string): boolean => pathname.startsWith(href);

  return (
    <Disclosure as="nav" className="bg-gray-800 pb-0.5">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center ">
                  <Logo className="text-white" size="small" />
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((link) => (
                      <Link
                        aria-current={isCurrent(link.href) ? 'page' : undefined}
                        className={clsx(
                          isCurrent(link.href)
                            ? 'border-brand-500 text-white'
                            : 'border-transparent text-gray-300 hover:border-gray-200 hover:text-gray-400',
                          'inline-flex items-center border-b-4 px-1 pt-1 text-sm font-medium'
                        )}
                        href={link.href}
                        key={link.name}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <UserMenu user={user} />
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon aria-hidden="true" className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((link) => (
                <Disclosure.Button
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                  as="a"
                  className={clsx(
                    isCurrent(link.href)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  href={link.href}
                  key={link.name}
                >
                  {link.name}
                </Disclosure.Button>
              ))}
            </div>
            <UserMobileMenu user={user} />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

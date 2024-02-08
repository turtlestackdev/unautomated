'use client';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/ui/branding/Logo';
import { Link } from '@/ui/Link';
import { UserMenu, UserMobileMenu } from '@/ui/layout/UserMenu';
import { usePathname } from 'next/navigation';
import type { SessionUser } from '@/auth';

export interface NavProps {
  user?: SessionUser;
}

export default function PublicNav({ user }: NavProps) {
  const pathname = usePathname();
  const showLoginLink = !user && pathname !== '/login';

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={'/'}>
                    <Logo size={'small'} />
                  </Link>
                </div>
              </div>
              {user && <UserMenu user={user} />}
              {showLoginLink && (
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <Link href={'/login'}>
                    Log in <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              )}
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-brand-50 border-brand-500 text-brand-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-brand-500 bg-brand-50 py-2 pl-3 pr-4 text-base font-medium text-brand-700"
              >
                Dashboard
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                Team
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                Projects
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              >
                Calendar
              </Disclosure.Button>
            </div>
            {user && <UserMobileMenu user={user} />}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

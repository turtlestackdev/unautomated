import type { ReactElement, ReactNode } from 'react';
import { clsx } from 'clsx';

type NavLink = {
  name: string;
  current: boolean;
} & ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

export function VerticalNav({ children }: { children?: ReactNode }): ReactElement {
  return (
    <nav aria-label="Sidebar" className="flex flex-1 flex-col">
      <ul className="-mx-2 space-y-1 whitespace-nowrap">{children}</ul>
    </nav>
  );
}

export function VerticalNavLink({
  link,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  link: NavLink;
}): ReactElement {
  return (
    <li className={className} {...props}>
      {'href' in props ? (
        <a
          className={clsx(
            link.current ? 'text-brand-600' : 'text-gray-800  hover:text-brand-600',
            'group flex gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6'
          )}
          href={link.href}
        >
          {link.name}
        </a>
      ) : (
        <button
          className={clsx(
            link.current ? 'text-brand-600' : 'text-gray-800  hover:text-brand-600',
            'group flex gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6'
          )}
          onClick={link.onClick}
          type="button"
        >
          {link.name}
        </button>
      )}
    </li>
  );
}

VerticalNav.Link = VerticalNavLink;

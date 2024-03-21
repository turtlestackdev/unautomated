import { type ReactNode } from 'react';
import { clsx } from 'clsx';

export function VerticalNav({ children }: { children?: ReactNode }): React.JSX.Element {
  return (
    <nav aria-label="Sidebar" className="flex flex-1 flex-col">
      <ul className="space-y-1 whitespace-nowrap">{children}</ul>
    </nav>
  );
}

type NavLink = {
  name: string;
  current: boolean;
} & ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

export function VerticalNavLink({
  link,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  link: NavLink;
}): React.JSX.Element {
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

type NavItem = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<'li'> & {
    current?: boolean;
  } & ({ href?: string; onClick?: never } | { href?: never; onClick?: () => void })
>;

export function VerticalNavItem({
  current = false,
  children,
  className,
  ...props
}: NavItem): React.JSX.Element {
  const classes = clsx(
    className,
    current ? 'text-brand-600' : 'text-gray-800',
    'group inline-block rounded-md py-2 text-sm font-semibold leading-6'
  );

  let Component = <span className={classes}>{children}</span>;

  if ('href' in props) {
    Component = (
      <a className={clsx(classes, 'hover:text-brand-600')} href={props.href}>
        {children}
      </a>
    );
  } else if ('onClick' in props) {
    Component = (
      <button
        className={clsx(classes, 'hover:text-brand-600')}
        onClick={props.onClick}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <li className="truncate" {...props}>
      {Component}
    </li>
  );
}

VerticalNav.Item = VerticalNavItem;

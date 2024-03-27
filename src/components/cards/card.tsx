import { clsx } from 'clsx';

export function Card({
  className,
  children,
  ...props
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<'div'>>): React.JSX.Element {
  return (
    <div className={clsx(className, 'rounded-lg bg-white shadow')} {...props}>
      {children}
    </div>
  );
}

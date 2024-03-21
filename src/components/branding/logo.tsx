import { Orbitron } from 'next/font/google';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

const orbitron = Orbitron({ weight: '400', subsets: ['latin'] });
const orbitronBold = Orbitron({ weight: '700', subsets: ['latin'] });

type LogoSize = 'small' | 'medium' | 'large' | 'x-large';
const typography = {
  small: 'text-lg sm:text-xl',
  medium: 'text-2xl sm:text-3xl',
  large: 'text-3xl sm:text-5xl',
  'x-large': 'text-4xl sm:text-7xl',
} as const;

export type LogoProps<T extends React.ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  size?: LogoSize;
  className?: string;
};

export function Logo<T extends React.ElementType>({
  as,
  size = 'medium',
  className,

  ...props
}: LogoProps<T>): ReactElement {
  const Component = as ?? 'h1';

  const classes = clsx(className, typography[size], orbitron.className);

  return (
    <Component className={classes} {...props}>
      <span className={clsx(orbitronBold.className, 'text-brand-500')}>UN</span>automated
    </Component>
  );
}

declare module '@/icons/*.svg' {
  import { type SVGProps } from 'react';

  const Icon: React.ComponentType<
    SVGProps<SVGSVGElement> & {
      primary?: string;
      secondary?: string;
    }
  >;
  export default Icon;
}

declare module '@/icons/*.svg?url' {
  const content: string;
  export default content;
}

import Image from 'next/image';
import Logo from '@/ui/branding/Logo';
import { Strong } from '@/ui/Text';

export default function Home() {
  return (
    <div className={'lg:px-8" mx-auto max-w-7xl px-6'}>
      <div className={'text-center'}>
        <Logo size={'x-large'} />
        <p className={'mt-10 text-xl text-zinc-500 sm:text-3xl dark:text-zinc-400'}>
          Finding <Strong className={'underline'}>real</Strong> people{' '}
          <Strong className={'underline'}>real</Strong> jobs.
        </p>
      </div>
    </div>
  );
}

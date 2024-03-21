import type { ReactElement } from 'react';
import { Button } from '@/components/button';
import { GitHubIcon } from '@/components/icons/social-icons';

export default function Page(): ReactElement {
  return (
    <div className={'lg:px-8" mx-auto max-w-7xl px-6'}>
      <div className="text-center">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in or create an account
        </h2>

        <Button className="mt-10" color="white" href="/login/github">
          <GitHubIcon className="h-5 w-5" /> Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}

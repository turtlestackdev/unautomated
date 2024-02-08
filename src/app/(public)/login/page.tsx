// app/login/page.tsx
import Logo from '@/ui/branding/Logo';
import { Strong } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { GitHubIcon } from '@/ui/icons/SocialIcons';

export default async function Page() {
  return (
    <>
      <div className={'lg:px-8" mx-auto max-w-7xl px-6'}>
        <div className={'text-center'}>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in or create an account
          </h2>

          <Button href="/login/github" className={'mt-10'} color={'white'}>
            <GitHubIcon className={'h-5 w-5'} /> Sign in with GitHub
          </Button>
        </div>
      </div>
    </>
  );
}

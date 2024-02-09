import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import PublicNav from '@/ui/layout/PublicNav';
import { validateRequest } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  return (
    <html lang="en" className={'h-full'}>
      <body className={`${inter.className} h-full bg-white`}>
        <PublicNav user={user} />
        <main className={'py-24 sm:py-32'}>{children}</main>
      </body>
    </html>
  );
}
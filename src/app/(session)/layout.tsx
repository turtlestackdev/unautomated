import { redirect } from 'next/navigation';
import { validateRequest } from '@/auth';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import ApplicationShell from '@/ui/layout/ApplicationShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unautomated - Dashboard',
  description: 'Resume Builder',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={'h-full'}>
      <body className={`${inter.className} h-full bg-gray-100`}>{children}</body>
    </html>
  );
}

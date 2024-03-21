import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import type { ReactElement } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unautomated - Dashboard',
  description: 'Resume Builder',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <html className="h-full" lang="en">
      <body className={`${inter.className} h-full w-[100vw] bg-gray-100`}>{children}</body>
    </html>
  );
}

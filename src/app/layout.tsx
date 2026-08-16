import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/components/providers/ReduxProvider';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IFG Product & Inventory Management Portal',
  description:
    'High-performance Product & Inventory Management Portal built with Next.js App Router, Redux Toolkit, React Hook Form, Yup, and pure Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} bg-[#F3F4F5] text-[#212121] antialiased min-h-screen flex flex-col`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

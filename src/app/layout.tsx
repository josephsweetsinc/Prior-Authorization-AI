import type { Metadata } from 'next';
import { Geist, Geist_Mono, Nunito } from 'next/font/google';

import '@/shared/styles/globals.css';
import { Container } from '@/views/layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const nunito = Nunito({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'PAAI',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        <Container>{children}</Container>
      </body>
    </html>
  );
}

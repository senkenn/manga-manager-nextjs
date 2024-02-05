import './globals.css';

import { Inter } from 'next/font/google';

import { AppProvider } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title      : 'Manga Manager',
  description: 'I like sushi, oh yeah.',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

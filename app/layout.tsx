import './globals.css';
import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({ 
  subsets: ['latin'],
  weight: '400',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={pressStart2P.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'A blog platform with AI writing assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

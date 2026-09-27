import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'ArchConnect KE - Admin',
  description: 'Admin dashboard for the ArchConnect KE architecture marketplace prototype.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 max-w-6xl">{children}</main>
      </body>
    </html>
  );
}

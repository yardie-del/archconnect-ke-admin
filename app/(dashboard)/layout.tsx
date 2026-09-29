import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 max-w-6xl">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
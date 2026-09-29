'use client';

import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        setAuthorized(false);
        setLoading(false);

        if (pathname !== '/login') {
          router.replace('/login');
        }

        return;
      }

      try {
        const adminRef = doc(db, 'admins', currentUser.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
          setAuthorized(false);
          await auth.signOut();
          router.replace('/login');
          return;
        }

        const adminData = adminSnap.data();

        if (adminData.role !== 'admin' || adminData.active !== true) {
          setAuthorized(false);
          await auth.signOut();
          router.replace('/login');
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Admin authorization failed:', error);
        setAuthorized(false);
        await auth.signOut();
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-500">
          Verifying admin access...
        </p>
      </div>
    );
  }

  if (!user || !authorized) {
    return null;
  }

  return <>{children}</>;
}
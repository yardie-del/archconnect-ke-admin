'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const NAV = [
  { href: '/', label: 'Overview', icon: '📊' },
  { href: '/users', label: 'Users', icon: '👤' },
  { href: '/professionals', label: 'Professionals', icon: '🏛️' },
  { href: '/projects', label: 'Projects', icon: '📁' },
  { href: '/bids', label: 'Bids', icon: '💰' },
  { href: '/payments', label: 'Payments', icon: '🏦' },
  { href: '/subscriptions', label: 'Subscriptions', icon: '🔄' },
  { href: '/disputes', label: 'Disputes', icon: '⚖️' },
  { href: '/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/reports', label: 'Reports', icon: '📈' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setEmail(user?.email ?? '');
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  }

  return (
    <aside className="w-60 shrink-0 bg-slateDark text-white h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-white/10">
        <p className="font-bold text-lg leading-tight">ArchConnect KE</p>
        <p className="text-xs text-white/50">Admin Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-kenyaGreen text-white font-semibold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3">
          <p className="text-xs text-white/40">Signed in as</p>
          <p className="text-xs text-white/80 truncate mt-1">
            {email || 'Admin'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
        >
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>

        <p className="text-[10px] text-white/30 mt-3">
          Prototype - simulated data only
        </p>
      </div>
    </aside>
  );
}
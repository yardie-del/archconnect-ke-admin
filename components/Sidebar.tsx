'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
                active ? 'bg-kenyaGreen text-white font-semibold' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-white/40">
        Prototype - simulated data only
      </div>
    </aside>
  );
}

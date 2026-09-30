'use client';

import { useEffect, useState } from 'react';

import StatCard from '@/components/StatCard';
import { getOverviewStats, OverviewStats } from '@/lib/firestore/overview';
import { platformStats, disputes, projects } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOverviewStats() {
      try {
        const data = await getOverviewStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load overview statistics:', error);
        setError('Unable to load live platform statistics.');
      } finally {
        setLoading(false);
      }
    }

    loadOverviewStats();
  }, []);

  const s = platformStats;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">
        Platform Overview
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Live user, professional and firm statistics are connected to Firestore.
        Project, dispute and financial metrics are still in development.
      </p>

      {error && (
        <div className="mt-4 bg-kenyaRed/5 border border-kenyaRed/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-kenyaRed">
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="Total Users"
          value={loading ? '...' : stats?.totalUsers ?? 0}
        />

        <StatCard
          label="Clients"
          value={loading ? '...' : stats?.clients ?? 0}
        />

        <StatCard
          label="Professionals"
          value={loading ? '...' : stats?.professionals ?? 0}
        />

        <StatCard
          label="Firms"
          value={loading ? '...' : stats?.firms ?? 0}
        />

        <StatCard
          label="Active Projects"
          value={s.activeProjects}
        />

        <StatCard
          label="Completed Projects"
          value={s.completedProjects}
          accent="text-mpesaGreen"
        />

        <StatCard
          label="Open Disputes"
          value={s.openDisputes}
          accent="text-kenyaRed"
        />

        <StatCard
          label="Subscription Revenue"
          value={formatKsh(s.subscriptionRevenueKsh)}
          accent="text-safariGold"
        />

        <StatCard
          label="Platform Commission"
          value={formatKsh(s.platformCommissionKsh)}
          accent="text-kenyaGreen"
        />
      </div>

      {disputes.filter((d) => d.status !== 'Resolved').length > 0 && (
        <div className="mt-8 bg-kenyaRed/5 border border-kenyaRed/20 rounded-xl p-4">
          <p className="text-sm font-bold text-kenyaRed">
            {disputes.filter((d) => d.status !== 'Resolved').length} dispute(s) need attention
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Head to the Disputes tab to review and rule on open cases.
          </p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-bold text-slateDark mb-3">
          Recent Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <p className="font-semibold text-sm text-slateDark">
                {p.title}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {p.clientName} - {p.location}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                {formatKsh(p.budgetMinKsh)} - {formatKsh(p.budgetMaxKsh)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

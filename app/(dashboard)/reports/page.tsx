'use client';

import { useEffect, useState } from 'react';

import { formatKsh } from '@/lib/format';
import {
  getReportsStats,
  ReportsStats,
} from '@/lib/firestore/reports';

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError('');

        const data = await getReportsStats();

        setStats(data);
      } catch (err) {
        console.error(
          'Failed to load reports:',
          err
        );

        setError(
          'Unable to load reports. Please check your Firebase permissions and data.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Reports
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading reports...
        </p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Reports
        </h1>

        <p className="text-sm text-red-600 mt-4">
          {error || 'Unable to load reports.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">
        Reports
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Live summary figures from the platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">
            Project Completion Rate
          </p>

          <p className="text-3xl font-bold text-mpesaGreen">
            {stats.completionRate}%
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {stats.completedProjects} of{' '}
            {stats.totalProjects} projects completed
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">
            Total Revenue (Subscriptions + Commission)
          </p>

          <p className="text-3xl font-bold text-kenyaGreen">
            {formatKsh(stats.totalRevenueKsh)}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {formatKsh(stats.subscriptionRevenueKsh)}{' '}
            subscriptions +{' '}
            {formatKsh(stats.platformCommissionKsh)}{' '}
            commission
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">
            Escrow Currently Held
          </p>

          <p className="text-3xl font-bold text-safariGold">
            {formatKsh(stats.escrowHeldKsh)}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Across all active milestone payments
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">
            Subscriptions Needing Renewal
          </p>

          <p className="text-3xl font-bold text-kenyaRed">
            {stats.subscriptionsNeedingRenewal}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Expiring soon or already expired
          </p>
        </div>
      </div>
    </div>
  );
}
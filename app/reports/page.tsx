import { platformStats, projects, payments, subscriptions } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function ReportsPage() {
  const completionRate =
    projects.length === 0 ? 0 : Math.round((platformStats.completedProjects / projects.length) * 100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Reports</h1>
      <p className="text-sm text-slate-500 mt-1">Summary figures for platform health and revenue.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">Project Completion Rate</p>
          <p className="text-3xl font-bold text-mpesaGreen">{completionRate}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {platformStats.completedProjects} of {projects.length} projects completed
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">Total Revenue (Subscriptions + Commission)</p>
          <p className="text-3xl font-bold text-kenyaGreen">
            {formatKsh(platformStats.subscriptionRevenueKsh + platformStats.platformCommissionKsh)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatKsh(platformStats.subscriptionRevenueKsh)} subscriptions + {formatKsh(platformStats.platformCommissionKsh)} commission
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">Escrow Currently Held</p>
          <p className="text-3xl font-bold text-safariGold">
            {formatKsh(payments.filter((p) => p.status === 'Held in Escrow').reduce((s, p) => s + p.amountKsh, 0))}
          </p>
          <p className="text-xs text-slate-500 mt-1">Across all active milestone payments</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm font-bold text-slateDark mb-3">Subscriptions Needing Renewal</p>
          <p className="text-3xl font-bold text-kenyaRed">
            {subscriptions.filter((s) => s.status !== 'Active').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Expiring soon or already expired</p>
        </div>
      </div>
    </div>
  );
}

import StatCard from '@/components/StatCard';
import { platformStats, disputes, projects } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function OverviewPage() {
  const s = platformStats;
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Platform Overview</h1>
      <p className="text-sm text-slate-500 mt-1">
        Simulated statistics for the ArchConnect KE prototype - no real backend connected yet.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard label="Total Users" value={s.totalUsers} />
        <StatCard label="Clients" value={s.clients} />
        <StatCard label="Professionals" value={s.professionals} />
        <StatCard label="Active Projects" value={s.activeProjects} />
        <StatCard label="Completed Projects" value={s.completedProjects} accent="text-mpesaGreen" />
        <StatCard label="Open Disputes" value={s.openDisputes} accent="text-kenyaRed" />
        <StatCard label="Subscription Revenue" value={formatKsh(s.subscriptionRevenueKsh)} accent="text-safariGold" />
        <StatCard label="Platform Commission" value={formatKsh(s.platformCommissionKsh)} accent="text-kenyaGreen" />
      </div>

      {disputes.filter((d) => d.status !== 'Resolved').length > 0 && (
        <div className="mt-8 bg-kenyaRed/5 border border-kenyaRed/20 rounded-xl p-4">
          <p className="text-sm font-bold text-kenyaRed">
            {disputes.filter((d) => d.status !== 'Resolved').length} dispute(s) need attention
          </p>
          <p className="text-xs text-slate-500 mt-1">Head to the Disputes tab to review and rule on open cases.</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-bold text-slateDark mb-3">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-sm text-slateDark">{p.title}</p>
              <p className="text-xs text-slate-500 mt-1">{p.clientName} - {p.location}</p>
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

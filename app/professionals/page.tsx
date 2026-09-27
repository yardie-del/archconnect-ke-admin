import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { professionals } from '@/lib/mockData';

export default function ProfessionalsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Professionals</h1>
      <p className="text-sm text-slate-500 mt-1">Architecture firms, registered architects, graduates & students, by tier.</p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Name', render: (p) => <span className="font-medium">{p.name}</span> },
            { header: 'Firm / Practice', render: (p) => p.firmName },
            { header: 'Tier', render: (p) => <Badge label={p.tier} /> },
            { header: 'BORAQS Verified', render: (p) => (p.boraqsVerified ? '✅' : '—') },
            { header: 'Location', render: (p) => p.location },
            { header: 'Rating', render: (p) => `${p.rating.toFixed(1)} ★` },
            { header: 'Completed', render: (p) => p.completedProjects },
          ]}
          rows={professionals}
        />
      </div>
    </div>
  );
}

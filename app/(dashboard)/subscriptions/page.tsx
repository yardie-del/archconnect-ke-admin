import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { subscriptions } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function SubscriptionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Subscriptions</h1>
      <p className="text-sm text-slate-500 mt-1">Annual tier subscriptions paid by professionals.</p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Architect', render: (s) => <span className="font-medium">{s.architectName}</span> },
            { header: 'Tier', render: (s) => <Badge label={s.tier} /> },
            { header: 'Fee', render: (s) => formatKsh(s.feeKsh) },
            { header: 'Renewal Date', render: (s) => s.renewalDate },
            { header: 'Status', render: (s) => <Badge label={s.status} /> },
          ]}
          rows={subscriptions}
        />
      </div>
    </div>
  );
}

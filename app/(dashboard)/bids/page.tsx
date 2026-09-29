import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { bids } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function BidsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Bids</h1>
      <p className="text-sm text-slate-500 mt-1">All bids submitted by professionals across open projects.</p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Project', render: (b) => <span className="font-medium">{b.projectTitle}</span> },
            { header: 'Architect', render: (b) => b.architectName },
            { header: 'Tier', render: (b) => <Badge label={b.tier} /> },
            { header: 'Amount', render: (b) => formatKsh(b.amountKsh) },
            { header: 'Delivery', render: (b) => `${b.deliveryDays} days` },
            { header: 'Status', render: (b) => <Badge label={b.status} /> },
          ]}
          rows={bids}
        />
      </div>
    </div>
  );
}

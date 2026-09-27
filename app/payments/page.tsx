import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { payments } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Payments</h1>
      <p className="text-sm text-slate-500 mt-1">
        Simulated bank-transfer escrow transactions. No real money moves in this prototype.
      </p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Project / Milestone', render: (p) => <span className="font-medium">{p.projectTitle}</span> },
            { header: 'Client', render: (p) => p.clientName },
            { header: 'Architect', render: (p) => p.architectName },
            { header: 'Amount', render: (p) => formatKsh(p.amountKsh) },
            { header: 'Commission', render: (p) => formatKsh(p.commissionKsh) },
            { header: 'Method', render: (p) => p.method },
            { header: 'Status', render: (p) => <Badge label={p.status} /> },
            { header: 'Date', render: (p) => p.date },
          ]}
          rows={payments}
        />
      </div>
    </div>
  );
}

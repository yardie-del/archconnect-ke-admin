import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { disputes } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function DisputesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Disputes</h1>
      <p className="text-sm text-slate-500 mt-1">
        Case status flows: Open → Under Review → Resolved. Escrow funds stay held until a ruling is issued.
      </p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Case', render: (d) => <span className="font-medium">{d.caseId}</span> },
            { header: 'Project', render: (d) => d.projectTitle },
            { header: 'Client', render: (d) => d.clientName },
            { header: 'Architect', render: (d) => d.architectName },
            { header: 'Issue Type', render: (d) => d.issueType },
            { header: 'Escrow Held', render: (d) => formatKsh(d.escrowAmountKsh) },
            { header: 'Status', render: (d) => <Badge label={d.status} /> },
          ]}
          rows={disputes}
        />
      </div>

      {disputes.map((d) => (
        <div key={d.id} className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-bold text-slateDark">{d.caseId} - {d.projectTitle}</p>
          <p className="text-sm text-slate-600 mt-1 italic">"{d.description}"</p>
        </div>
      ))}
    </div>
  );
}

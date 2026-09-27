import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { projects } from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Projects</h1>
      <p className="text-sm text-slate-500 mt-1">Every project brief posted on the platform.</p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Title', render: (p) => <span className="font-medium">{p.title}</span> },
            { header: 'Client', render: (p) => p.clientName },
            { header: 'Category', render: (p) => p.category },
            { header: 'Location', render: (p) => p.location },
            { header: 'Budget', render: (p) => `${formatKsh(p.budgetMinKsh)} - ${formatKsh(p.budgetMaxKsh)}` },
            { header: 'Status', render: (p) => <Badge label={p.status} /> },
          ]}
          rows={projects}
        />
      </div>
    </div>
  );
}

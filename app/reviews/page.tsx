import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { reviews } from '@/lib/mockData';

export default function ReviewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Reviews</h1>
      <p className="text-sm text-slate-500 mt-1">Client reviews left on completed projects. Moderate flagged content here.</p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Client', render: (r) => r.clientName },
            { header: 'Architect', render: (r) => r.architectName },
            { header: 'Rating', render: (r) => `${r.rating}/5 ★` },
            { header: 'Comment', render: (r) => <span className="line-clamp-1">{r.comment}</span> },
            { header: 'Date', render: (r) => r.date },
            { header: 'Status', render: (r) => <Badge label={r.status} /> },
          ]}
          rows={reviews}
        />
      </div>
    </div>
  );
}

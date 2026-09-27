import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { users } from '@/lib/mockData';

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Users</h1>
      <p className="text-sm text-slate-500 mt-1">All clients and architects registered on the platform.</p>
      <div className="mt-6">
        <DataTable
          columns={[
            { header: 'Name', render: (u) => <span className="font-medium">{u.name}</span> },
            { header: 'Email', render: (u) => u.email },
            { header: 'Role', render: (u) => <Badge label={u.role} /> },
            { header: 'Location', render: (u) => u.location },
            { header: 'Joined', render: (u) => u.joined },
            { header: 'Status', render: (u) => <Badge label={u.status} /> },
          ]}
          rows={users}
        />
      </div>
    </div>
  );
}

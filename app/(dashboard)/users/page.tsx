'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { users as initialUsers, AdminUser } from '@/lib/mockData';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  const toggleUserStatus = (id: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'Active' ? 'Suspended' : 'Active',
            }
          : user
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">Users</h1>

      <p className="text-sm text-slate-500 mt-1">
        All clients and architects registered on the platform.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Name',
              render: (u) => (
                <span className="font-medium">{u.name}</span>
              ),
            },
            {
              header: 'Email',
              render: (u) => u.email,
            },
            {
              header: 'Role',
              render: (u) => <Badge label={u.role} />,
            },
            {
              header: 'Location',
              render: (u) => u.location,
            },
            {
              header: 'Joined',
              render: (u) => u.joined,
            },
            {
              header: 'Status',
              render: (u) => <Badge label={u.status} />,
            },
            {
              header: 'Action',
              render: (u) => (
                <button
                  onClick={() => toggleUserStatus(u.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    u.status === 'Active'
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {u.status === 'Active' ? 'Suspend' : 'Reactivate'}
                </button>
              ),
            },
          ]}
          rows={users}
        />
      </div>
    </div>
  );
}

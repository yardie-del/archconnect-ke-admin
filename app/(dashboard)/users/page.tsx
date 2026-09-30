'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import {
  getUsers,
  updateUserStatus,
  FirestoreUser,
} from '@/lib/firestore/users';

export default function UsersPage() {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError('');

      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleUserStatus(user: FirestoreUser) {
    const nextStatus =
      user.status === 'active' ? 'suspended' : 'active';

    try {
      setUpdatingId(user.id);
      setError('');

      await updateUserStatus(user.id, nextStatus);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                status: nextStatus,
              }
            : currentUser
        )
      );
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">
        Users
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        All clients and professionals registered on the platform.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading users...
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              {
                header: 'Name',
                render: (user) => (
                  <span className="font-medium">
                    {user.fullName}
                  </span>
                ),
              },
              {
                header: 'Email',
                render: (user) => user.email,
              },
              {
                header: 'Role',
                render: (user) => (
                  <Badge
                    label={
                      user.role === 'professional'
                        ? 'Professional'
                        : user.role === 'client'
                          ? 'Client'
                          : 'Admin'
                    }
                  />
                ),
              },
              {
                header: 'Location',
                render: (user) => user.location,
              },
              {
                header: 'Joined',
                render: (user) => {
                  if (!user.createdAt) {
                    return '—';
                  }

                  const timestamp = user.createdAt as {
                    toDate?: () => Date;
                  };

                  if (!timestamp.toDate) {
                    return '—';
                  }

                  return timestamp
                    .toDate()
                    .toLocaleDateString();
                },
              },
              {
                header: 'Status',
                render: (user) => (
                  <Badge
                    label={
                      user.status === 'active'
                        ? 'Active'
                        : 'Suspended'
                    }
                  />
                ),
              },
              {
                header: 'Action',
                render: (user) => {
                  const updating = updatingId === user.id;

                  return (
                    <button
                      onClick={() => toggleUserStatus(user)}
                      disabled={updating}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        user.status === 'active'
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      } disabled:opacity-50`}
                    >
                      {updating
                        ? 'Updating...'
                        : user.status === 'active'
                          ? 'Suspend'
                          : 'Reactivate'}
                    </button>
                  );
                },
              },
            ]}
            rows={users}
          />
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/DataTable';
import {
  FirestoreFirm,
  getFirms,
} from '@/lib/firestore/firms';

export default function FirmsPage() {
  const [firms, setFirms] = useState<FirestoreFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFirms() {
      try {
        setLoading(true);
        setError('');

        const data = await getFirms();

        setFirms(data);
      } catch (err) {
        console.error('Failed to load firms:', err);

        setError(
          'Unable to load firms. Please check your Firebase permissions.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadFirms();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Firms
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading architecture firms...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Firms
        </h1>

        <p className="text-sm text-red-600 mt-4">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Firms
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Registered architecture firms and practices on ArchConnect KE.
        </p>
      </div>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Firm',
              render: (firm) => (
                <span className="font-medium">
                  {firm.name}
                </span>
              ),
            },
            {
              header: 'Registration Number',
              render: (firm) => (
                <span className="font-mono text-xs">
                  {firm.registrationNumber}
                </span>
              ),
            },
            {
              header: 'Location',
              render: (firm) => firm.location,
            },
            {
              header: 'BORAQS Verification',
              render: (firm) =>
                firm.boraqsVerified ? (
                  <span className="text-emerald-600 font-semibold">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Not verified
                  </span>
                ),
            },
            {
              header: 'Status',
              render: (firm) => (
                <span
                  className={
                    firm.status === 'active'
                      ? 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700'
                      : 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700'
                  }
                >
                  {firm.status}
                </span>
              ),
            },
          ]}
          rows={firms}
        />
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import {
  professionals as initialProfessionals,
  AdminProfessional,
} from '@/lib/mockData';

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] =
    useState<AdminProfessional[]>(initialProfessionals);

  const toggleVerification = (id: string) => {
    setProfessionals((currentProfessionals) =>
      currentProfessionals.map((professional) =>
        professional.id === id
          ? {
              ...professional,
              boraqsVerified: !professional.boraqsVerified,
            }
          : professional
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">
        Professionals
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Architecture firms, registered architects, graduates & students, by
        tier.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Name',
              render: (p) => (
                <span className="font-medium">{p.name}</span>
              ),
            },
            {
              header: 'Firm / Practice',
              render: (p) => p.firmName,
            },
            {
              header: 'Tier',
              render: (p) => <Badge label={p.tier} />,
            },
            {
              header: 'BORAQS Verified',
              render: (p) =>
                p.boraqsVerified ? (
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
              header: 'Location',
              render: (p) => p.location,
            },
            {
              header: 'Rating',
              render: (p) => `${p.rating.toFixed(1)} ★`,
            },
            {
              header: 'Completed',
              render: (p) => p.completedProjects,
            },
            {
              header: 'Action',
              render: (p) => (
                <button
                  onClick={() => toggleVerification(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    p.boraqsVerified
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {p.boraqsVerified
                    ? 'Revoke Verification'
                    : 'Approve Verification'}
                </button>
              ),
            },
          ]}
          rows={professionals}
        />
      </div>
    </div>
  );
}

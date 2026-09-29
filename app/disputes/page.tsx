'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import {
  disputes as initialDisputes,
  AdminDispute,
} from '@/lib/mockData';
import { formatKsh } from '@/lib/format';

export default function DisputesPage() {
  const [disputes, setDisputes] =
    useState<AdminDispute[]>(initialDisputes);

  const updateDisputeStatus = (
    id: string,
    status: AdminDispute['status']
  ) => {
    setDisputes((currentDisputes) =>
      currentDisputes.map((dispute) =>
        dispute.id === id
          ? { ...dispute, status }
          : dispute
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">
        Disputes
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Case status flows: Open → Under Review → Resolved. Escrow funds
        stay held until a ruling is issued.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Case',
              render: (d) => (
                <span className="font-medium">{d.caseId}</span>
              ),
            },
            {
              header: 'Project',
              render: (d) => d.projectTitle,
            },
            {
              header: 'Client',
              render: (d) => d.clientName,
            },
            {
              header: 'Architect',
              render: (d) => d.architectName,
            },
            {
              header: 'Issue Type',
              render: (d) => d.issueType,
            },
            {
              header: 'Escrow Held',
              render: (d) => formatKsh(d.escrowAmountKsh),
            },
            {
              header: 'Status',
              render: (d) => <Badge label={d.status} />,
            },
            {
              header: 'Action',
              render: (d) => (
                <div className="flex gap-2">
                  {d.status !== 'Under Review' &&
                    d.status !== 'Resolved' && (
                      <button
                        onClick={() =>
                          updateDisputeStatus(
                            d.id,
                            'Under Review'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
                      >
                        Review
                      </button>
                    )}

                  {d.status !== 'Resolved' && (
                    <button
                      onClick={() =>
                        updateDisputeStatus(
                          d.id,
                          'Resolved'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          rows={disputes}
        />
      </div>

      {disputes.map((d) => (
        <div
          key={d.id}
          className="mt-4 bg-white border border-slate-200 rounded-xl p-4"
        >
          <p className="text-sm font-bold text-slateDark">
            {d.caseId} - {d.projectTitle}
          </p>

          <p className="text-sm text-slate-600 mt-1 italic">
            "{d.description}"
          </p>

          <p className="text-xs text-slate-400 mt-2">
            Current status: {d.status}
          </p>
        </div>
      ))}
    </div>
  );
}

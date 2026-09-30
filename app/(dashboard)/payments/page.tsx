'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { formatKsh } from '@/lib/format';

import {
  FirestorePayment,
  getPayments,
} from '@/lib/firestore/payments';

import {
  FirestoreProject,
  getProjects,
} from '@/lib/firestore/projects';

import {
  FirestoreProfessional,
  getProfessionals,
} from '@/lib/firestore/professionals';

import {
  FirestoreUser,
  getUsers,
} from '@/lib/firestore/users';

type PaymentRow = FirestorePayment & {
  projectTitle: string;
  clientName: string;
  professionalName: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setError('');

        const [
          paymentData,
          projectData,
          professionalData,
          userData,
        ] = await Promise.all([
          getPayments(),
          getProjects(),
          getProfessionals(),
          getUsers(),
        ]);

        const projectMap = new Map<string, FirestoreProject>(
          projectData.map((project) => [project.id, project])
        );

        const userMap = new Map<string, FirestoreUser>(
          userData.map((user) => [user.id, user])
        );

        const professionalMap = new Map<
          string,
          FirestoreProfessional
        >(
          professionalData.map((professional) => [
            professional.id,
            professional,
          ])
        );

        const rows: PaymentRow[] = paymentData.map((payment) => {
          const project = projectMap.get(payment.projectId);
          const client = userMap.get(payment.clientId);
          const professional = professionalMap.get(
            payment.professionalId
          );
          const professionalUser = professional
            ? userMap.get(professional.userId)
            : undefined;

          return {
            ...payment,
            projectTitle:
              project?.title ?? 'Unknown project',
            clientName:
              client?.fullName ?? 'Unknown client',
            professionalName:
              professionalUser?.fullName ?? 'Unknown professional',
          };
        });

        setPayments(rows);
      } catch (err) {
        console.error('Failed to load payments:', err);

        setError(
          'Unable to load payments. Please check your Firebase permissions and payment data.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Payments
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading payments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Payments
        </h1>

        <p className="text-sm text-red-600 mt-4">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slateDark">
        Payments
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Escrow transactions recorded on the platform.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Project / Milestone',
              render: (payment) => (
                <div>
                  <span className="font-medium">
                    {payment.projectTitle}
                  </span>

                  <p className="text-xs text-slate-500">
                    {payment.milestone}
                  </p>
                </div>
              ),
            },
            {
              header: 'Client',
              render: (payment) => payment.clientName,
            },
            {
              header: 'Architect',
              render: (payment) =>
                payment.professionalName,
            },
            {
              header: 'Amount',
              render: (payment) =>
                formatKsh(payment.amountKsh),
            },
            {
              header: 'Commission',
              render: (payment) =>
                formatKsh(payment.commissionKsh),
            },
            {
              header: 'Method',
              render: (payment) =>
                payment.method === 'bank_transfer'
                  ? 'Bank Transfer'
                  : 'M-Pesa',
            },
            {
              header: 'Status',
              render: (payment) => (
                <Badge
                  label={
                    payment.status === 'held'
                      ? 'Held in Escrow'
                      : payment.status === 'released'
                        ? 'Released'
                        : 'Refunded'
                  }
                />
              ),
            },
            {
              header: 'Date',
              render: (payment) => {
                if (!payment.createdAt) {
                  return '—';
                }

                const timestamp =
                  payment.createdAt as {
                    toDate?: () => Date;
                  };

                return timestamp.toDate
                  ? timestamp.toDate().toLocaleDateString()
                  : '—';
              },
            },
          ]}
          rows={payments}
        />
      </div>
    </div>
  );
}

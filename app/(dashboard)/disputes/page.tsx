'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { formatKsh } from '@/lib/format';

import {
  FirestoreDispute,
  getDisputes,
} from '@/lib/firestore/disputes';

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

type DisputeRow = FirestoreDispute & {
  projectTitle: string;
  clientName: string;
  professionalName: string;
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<
    DisputeRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDisputes() {
      try {
        setLoading(true);
        setError('');

        const [
          disputeData,
          projectData,
          professionalData,
          userData,
        ] = await Promise.all([
          getDisputes(),
          getProjects(),
          getProfessionals(),
          getUsers(),
        ]);

        const projectMap = new Map<
          string,
          FirestoreProject
        >(
          projectData.map((project) => [
            project.id,
            project,
          ])
        );

        const userMap = new Map<
          string,
          FirestoreUser
        >(
          userData.map((user) => [
            user.id,
            user,
          ])
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

        const rows: DisputeRow[] =
          disputeData.map((dispute) => {
            const project = projectMap.get(
              dispute.projectId
            );

            const client = userMap.get(
              dispute.clientId
            );

            const professional =
              professionalMap.get(
                dispute.professionalId
              );

            const professionalUser =
              professional
                ? userMap.get(
                    professional.userId
                  )
                : undefined;

            return {
              ...dispute,
              projectTitle:
                project?.title ??
                'Unknown project',
              clientName:
                client?.fullName ??
                'Unknown client',
              professionalName:
                professionalUser?.fullName ??
                'Unknown professional',
            };
          });

        setDisputes(rows);
      } catch (err) {
        console.error(
          'Failed to load disputes:',
          err
        );

        setError(
          'Unable to load disputes. Please check your Firebase permissions and dispute data.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadDisputes();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Disputes
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading disputes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Disputes
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
        Disputes
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Case status flows: Open → Under Review → Resolved.
        Escrow funds stay held until a ruling is issued.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Case',
              render: (dispute) => (
                <span className="font-medium">
                  {dispute.caseId}
                </span>
              ),
            },
            {
              header: 'Project',
              render: (dispute) =>
                dispute.projectTitle,
            },
            {
              header: 'Client',
              render: (dispute) =>
                dispute.clientName,
            },
            {
              header: 'Architect',
              render: (dispute) =>
                dispute.professionalName,
            },
            {
              header: 'Issue Type',
              render: (dispute) =>
                dispute.issueType,
            },
            {
              header: 'Escrow Held',
              render: (dispute) =>
                formatKsh(
                  dispute.escrowAmountKsh
                ),
            },
            {
              header: 'Status',
              render: (dispute) => (
                <Badge
                  label={
                    dispute.status ===
                    'under_review'
                      ? 'Under Review'
                      : dispute.status ===
                          'resolved'
                        ? 'Resolved'
                        : 'Open'
                  }
                />
              ),
            },
            {
              header: 'Description',
              render: (dispute) => (
                <span className="text-sm text-slate-600">
                  {dispute.description}
                </span>
              ),
            },
          ]}
          rows={disputes}
        />
      </div>
    </div>
  );
}
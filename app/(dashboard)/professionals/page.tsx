'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';

import {
  FirestoreProfessional,
  getProfessionals,
  updateProfessionalVerification,
} from '@/lib/firestore/professionals';

import { getFirms, FirestoreFirm } from '@/lib/firestore/firms';
import { getUsers, FirestoreUser } from '@/lib/firestore/users';

type ProfessionalRow = FirestoreProfessional & {
  name: string;
  firmName: string;
  location: string;
};

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<ProfessionalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfessionals() {
      try {
        setLoading(true);
        setError('');

        const [professionalData, firmData, userData] =
          await Promise.all([
            getProfessionals(),
            getFirms(),
            getUsers(),
          ]);

        const firmMap = new Map<string, FirestoreFirm>(
          firmData.map((firm) => [firm.id, firm])
        );

        const userMap = new Map<string, FirestoreUser>(
          userData.map((user) => [user.id, user])
        );

        const rows: ProfessionalRow[] = professionalData.map(
          (professional) => {
            const user = userMap.get(professional.userId);
            const firm = professional.firmId
              ? firmMap.get(professional.firmId)
              : undefined;

            return {
              ...professional,
              name: user?.fullName ?? 'Unknown professional',
              firmName: firm?.name ?? 'Independent',
              location: user?.location ?? firm?.location ?? '—',
            };
          }
        );

        setProfessionals(rows);
      } catch (err) {
        console.error('Failed to load professionals:', err);
        setError(
          'Unable to load professionals. Please check your Firebase permissions.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfessionals();
  }, []);

  async function handleVerificationChange(
    professionalId: string,
    verified: boolean
  ) {
    try {
      setUpdatingId(professionalId);

      await updateProfessionalVerification(
        professionalId,
        verified
      );

      setProfessionals((current) =>
        current.map((professional) =>
          professional.id === professionalId
            ? {
                ...professional,
                boraqsVerified: verified,
              }
            : professional
        )
      );
    } catch (err) {
      console.error(
        'Failed to update professional verification:',
        err
      );

      window.alert(
        'Unable to update verification status. Please try again.'
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Professionals
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading professionals...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Professionals
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
              render: (professional) => (
                <span className="font-medium">
                  {professional.name}
                </span>
              ),
            },
            {
              header: 'Firm / Practice',
              render: (professional) =>
                professional.firmName,
            },
            {
              header: 'Tier',
              render: (professional) => (
                <Badge
                  label={professional.membershipTier}
                />
              ),
            },
            {
              header: 'BORAQS Verified',
              render: (professional) => (
                <div className="flex items-center gap-3">
                  {professional.boraqsVerified ? (
                    <span className="text-emerald-600 font-semibold">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Not verified
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={updatingId === professional.id}
                    onClick={() =>
                      handleVerificationChange(
                        professional.id,
                        !professional.boraqsVerified
                      )
                    }
                    className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-50"
                  >
                    {updatingId === professional.id
                      ? 'Updating...'
                      : professional.boraqsVerified
                        ? 'Unverify'
                        : 'Verify'}
                  </button>
                </div>
              ),
            },
            {
              header: 'Location',
              render: (professional) =>
                professional.location,
            },
            {
              header: 'Rating',
              render: (professional) =>
                `${professional.rating.toFixed(1)} ★`,
            },
            {
              header: 'Completed',
              render: (professional) =>
                professional.completedProjects,
            },
          ]}
          rows={professionals}
        />
      </div>
    </div>
  );
}
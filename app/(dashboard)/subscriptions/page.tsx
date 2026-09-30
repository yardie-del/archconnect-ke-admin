'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';
import { formatKsh } from '@/lib/format';

import {
  FirestoreSubscription,
  getSubscriptions,
} from '@/lib/firestore/subscriptions';

import {
  FirestoreProfessional,
  getProfessionals,
} from '@/lib/firestore/professionals';

import {
  FirestoreUser,
  getUsers,
} from '@/lib/firestore/users';

type SubscriptionRow = FirestoreSubscription & {
  professionalName: string;
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<
    SubscriptionRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        setLoading(true);
        setError('');

        const [
          subscriptionData,
          professionalData,
          userData,
        ] = await Promise.all([
          getSubscriptions(),
          getProfessionals(),
          getUsers(),
        ]);

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

        const rows: SubscriptionRow[] =
          subscriptionData.map((subscription) => {
            const professional = professionalMap.get(
              subscription.professionalId
            );

            const professionalUser = professional
              ? userMap.get(professional.userId)
              : undefined;

            return {
              ...subscription,
              professionalName:
                professionalUser?.fullName ??
                'Unknown professional',
            };
          });

        setSubscriptions(rows);
      } catch (err) {
        console.error(
          'Failed to load subscriptions:',
          err
        );

        setError(
          'Unable to load subscriptions. Please check your Firebase permissions and subscription data.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptions();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Subscriptions
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading subscriptions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Subscriptions
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
        Subscriptions
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Annual tier subscriptions paid by professionals.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Professional',
              render: (subscription) => (
                <span className="font-medium">
                  {subscription.professionalName}
                </span>
              ),
            },
            {
              header: 'Tier',
              render: (subscription) => (
                <Badge label={subscription.tier} />
              ),
            },
            {
              header: 'Fee',
              render: (subscription) =>
                formatKsh(subscription.feeKsh),
            },
            {
              header: 'Renewal Date',
              render: (subscription) => {
                if (!subscription.expiresAt) {
                  return '—';
                }

                const timestamp =
                  subscription.expiresAt as {
                    toDate?: () => Date;
                  };

                return timestamp.toDate
                  ? timestamp
                      .toDate()
                      .toLocaleDateString()
                  : '—';
              },
            },
            {
              header: 'Status',
              render: (subscription) => (
                <Badge
                  label={
                    subscription.status === 'active'
                      ? 'Active'
                      : subscription.status ===
                          'expiring_soon'
                        ? 'Expiring Soon'
                        : 'Expired'
                  }
                />
              ),
            },
          ]}
          rows={subscriptions}
        />
      </div>
    </div>
  );
}

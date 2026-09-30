'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/DataTable';
import Badge from '@/components/Badge';

import {
  FirestoreReview,
  getReviews,
} from '@/lib/firestore/reviews';

import {
  FirestoreProfessional,
  getProfessionals,
} from '@/lib/firestore/professionals';

import {
  FirestoreUser,
  getUsers,
} from '@/lib/firestore/users';

type ReviewRow = FirestoreReview & {
  clientName: string;
  professionalName: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<
    ReviewRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError('');

        const [
          reviewData,
          professionalData,
          userData,
        ] = await Promise.all([
          getReviews(),
          getProfessionals(),
          getUsers(),
        ]);

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

        const rows: ReviewRow[] =
          reviewData.map((review) => {
            const client = userMap.get(
              review.clientId
            );

            const professional =
              professionalMap.get(
                review.professionalId
              );

            const professionalUser =
              professional
                ? userMap.get(
                    professional.userId
                  )
                : undefined;

            return {
              ...review,
              clientName:
                client?.fullName ??
                'Unknown client',
              professionalName:
                professionalUser?.fullName ??
                'Unknown professional',
            };
          });

        setReviews(rows);
      } catch (err) {
        console.error(
          'Failed to load reviews:',
          err
        );

        setError(
          'Unable to load reviews. Please check your Firebase permissions and review data.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Reviews
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Loading reviews...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slateDark">
          Reviews
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
        Reviews
      </h1>

      <p className="text-sm text-slate-500 mt-1">
        Client reviews left on completed projects.
        Moderate flagged content here.
      </p>

      <div className="mt-6">
        <DataTable
          columns={[
            {
              header: 'Client',
              render: (review) =>
                review.clientName,
            },
            {
              header: 'Architect',
              render: (review) =>
                review.professionalName,
            },
            {
              header: 'Rating',
              render: (review) =>
                `${review.rating}/5 ★`,
            },
            {
              header: 'Comment',
              render: (review) => (
                <span className="line-clamp-1">
                  {review.comment}
                </span>
              ),
            },
            {
              header: 'Date',
              render: (review) => {
                if (!review.createdAt) {
                  return '—';
                }

                const timestamp =
                  review.createdAt as {
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
              render: (review) => (
                <Badge
                  label={
                    review.status === 'flagged'
                      ? 'Flagged'
                      : 'Published'
                  }
                />
              ),
            },
          ]}
          rows={reviews}
        />
      </div>
    </div>
  );
}
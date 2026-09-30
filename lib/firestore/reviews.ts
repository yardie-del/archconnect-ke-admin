import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type ReviewStatus =
  | 'published'
  | 'flagged';

export interface FirestoreReview {
  id: string;
  clientId: string;
  professionalId: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const reviewsCollection = collection(
  db,
  'reviews'
);

export async function getReviews(): Promise<
  FirestoreReview[]
> {
  const reviewsQuery = query(
    reviewsCollection,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(reviewsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<
      FirestoreReview,
      'id'
    >),
  }));
}
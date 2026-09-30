import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type SubscriptionTier =
  | 'Diamond'
  | 'Gold'
  | 'Silver'
  | 'Bronze';

export type SubscriptionStatus =
  | 'active'
  | 'expiring_soon'
  | 'expired';

export interface FirestoreSubscription {
  id: string;
  professionalId: string;
  tier: SubscriptionTier;
  feeKsh: number;
  status: SubscriptionStatus;
  startsAt?: unknown;
  expiresAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const subscriptionsCollection = collection(
  db,
  'subscriptions'
);

export async function getSubscriptions(): Promise<
  FirestoreSubscription[]
> {
  const subscriptionsQuery = query(
    subscriptionsCollection,
    orderBy('expiresAt', 'asc')
  );

  const snapshot = await getDocs(subscriptionsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<
      FirestoreSubscription,
      'id'
    >),
  }));
}

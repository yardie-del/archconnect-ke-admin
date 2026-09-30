import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type BidStatus =
  | 'submitted'
  | 'accepted'
  | 'rejected';

export interface FirestoreBid {
  id: string;
  projectId: string;
  professionalId: string;
  amountKsh: number;
  deliveryDays: number;
  status: BidStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const bidsCollection = collection(db, 'bids');

export async function getBids(): Promise<FirestoreBid[]> {
  const bidsQuery = query(
    bidsCollection,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(bidsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FirestoreBid, 'id'>),
  }));
}
import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type DisputeStatus =
  | 'open'
  | 'under_review'
  | 'resolved';

export interface FirestoreDispute {
  id: string;
  caseId: string;
  projectId: string;
  clientId: string;
  professionalId: string;
  issueType: string;
  escrowAmountKsh: number;
  status: DisputeStatus;
  description: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const disputesCollection = collection(
  db,
  'disputes'
);

export async function getDisputes(): Promise<
  FirestoreDispute[]
> {
  const disputesQuery = query(
    disputesCollection,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(disputesQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<
      FirestoreDispute,
      'id'
    >),
  }));
}
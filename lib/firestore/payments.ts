import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type PaymentStatus =
  | 'held'
  | 'released'
  | 'refunded';

export type PaymentMethod =
  | 'bank_transfer'
  | 'mpesa';

export interface FirestorePayment {
  id: string;
  projectId: string;
  clientId: string;
  professionalId: string;
  amountKsh: number;
  commissionKsh: number;
  milestone: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
  releasedAt?: unknown;
}

const paymentsCollection = collection(db, 'payments');

export async function getPayments(): Promise<FirestorePayment[]> {
  const paymentsQuery = query(
    paymentsCollection,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(paymentsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FirestorePayment, 'id'>),
  }));
}
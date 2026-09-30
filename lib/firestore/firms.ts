import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface FirestoreFirm {
  id: string;
  name: string;
  registrationNumber: string;
  location: string;
  boraqsVerified: boolean;
  status: 'active' | 'suspended';
}

const firmsCollection = collection(db, 'firms');

export async function getFirms(): Promise<FirestoreFirm[]> {
  const firmsQuery = query(
    firmsCollection,
    orderBy('name')
  );

  const snapshot = await getDocs(firmsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FirestoreFirm, 'id'>),
  }));
}
import {
  collection,
  getDocs,
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
  const snapshot = await getDocs(firmsCollection);
  const firms = snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FirestoreFirm, 'id'>),
  }));

  return firms.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
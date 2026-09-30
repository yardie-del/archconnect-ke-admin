import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type ProfessionalType =
  | 'architect'
  | 'graduate'
  | 'student';

export type MembershipTier =
  | 'Diamond'
  | 'Gold'
  | 'Silver'
  | 'Bronze';

export interface FirestoreProfessional {
  id: string;
  userId: string;
  firmId?: string | null;
  professionalType: ProfessionalType;
  membershipTier: MembershipTier;
  boraqsVerified: boolean;
  rating: number;
  completedProjects: number;
  updatedAt?: unknown;
}

const professionalsCollection = collection(db, 'professionals');

export async function getProfessionals(): Promise<
  FirestoreProfessional[]
> {
  const professionalsQuery = query(
    professionalsCollection,
    orderBy('rating', 'desc')
  );

  const snapshot = await getDocs(professionalsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FirestoreProfessional, 'id'>),
  }));
}

export async function updateProfessionalVerification(
  professionalId: string,
  boraqsVerified: boolean
) {
  const professionalRef = doc(
    db,
    'professionals',
    professionalId
  );

  await updateDoc(professionalRef, {
    boraqsVerified,
    updatedAt: serverTimestamp(),
  });
}
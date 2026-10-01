import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { httpsCallable } from 'firebase/functions';

import { db, functions } from '@/lib/firebase';

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
  const updateProfessionalVerificationFn = httpsCallable<
    {
      professionalId: string;
      boraqsVerified: boolean;
    },
    {
      success: boolean;
      professionalId: string;
      boraqsVerified: boolean;
    }
  >(functions, 'updateProfessionalVerification');

  const result = await updateProfessionalVerificationFn({
    professionalId,
    boraqsVerified,
  });

  return result.data;
}
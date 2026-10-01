import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { httpsCallable } from 'firebase/functions';

import { db, functions } from '@/lib/firebase';

export type UserRole = 'client' | 'professional' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface FirestoreUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  location: string;
  photoURL?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const usersCollection = collection(db, 'users');

export async function getUsers(): Promise<FirestoreUser[]> {
  const usersQuery = query(
    usersCollection,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(usersQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FirestoreUser, 'id'>),
  }));
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
) {
  const updateUserStatusFn = httpsCallable<
    { userId: string; status: UserStatus },
    {
      success: boolean;
      userId: string;
      status: UserStatus;
    }
  >(functions, 'updateUserStatus');

  const result = await updateUserStatusFn({
    userId,
    status,
  });

  return result.data;
}

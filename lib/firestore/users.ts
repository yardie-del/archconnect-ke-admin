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
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
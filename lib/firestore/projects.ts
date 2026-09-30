import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export type ProjectStatus =
  | 'open'
  | 'in_progress'
  | 'completed'
  | 'disputed';

export interface FirestoreProject {
  id: string;
  title: string;
  clientId: string;
  category: string;
  location: string;
  budgetMinKsh: number;
  budgetMaxKsh: number;
  status: ProjectStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const projectsCollection = collection(db, 'projects');

export async function getProjects(): Promise<FirestoreProject[]> {
  const projectsQuery = query(
    projectsCollection,
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FirestoreProject, 'id'>),
  }));
}

import { getFirms } from '@/lib/firestore/firms';
import { getProfessionals } from '@/lib/firestore/professionals';
import { getUsers } from '@/lib/firestore/users';

export interface OverviewStats {
  totalUsers: number;
  clients: number;
  professionals: number;
  firms: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const [users, professionals, firms] = await Promise.all([
    getUsers(),
    getProfessionals(),
    getFirms(),
  ]);

  return {
    totalUsers: users.length,
    clients: users.filter((user) => user.role === 'client').length,
    professionals: professionals.length,
    firms: firms.length,
  };
}

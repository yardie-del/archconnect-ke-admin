import { getDisputes } from '@/lib/firestore/disputes';
import { getPayments } from '@/lib/firestore/payments';
import { getProfessionals } from '@/lib/firestore/professionals';
import { getProjects } from '@/lib/firestore/projects';
import { getSubscriptions } from '@/lib/firestore/subscriptions';
import { getUsers } from '@/lib/firestore/users';

export interface ReportsStats {
  totalProjects: number;
  completedProjects: number;
  completionRate: number;
  subscriptionRevenueKsh: number;
  platformCommissionKsh: number;
  totalRevenueKsh: number;
  escrowHeldKsh: number;
  subscriptionsNeedingRenewal: number;
  openDisputes: number;
  totalUsers: number;
  totalProfessionals: number;
}

export async function getReportsStats(): Promise<ReportsStats> {
  const [
    projects,
    payments,
    subscriptions,
    disputes,
    users,
    professionals,
  ] = await Promise.all([
    getProjects(),
    getPayments(),
    getSubscriptions(),
    getDisputes(),
    getUsers(),
    getProfessionals(),
  ]);

  const completedProjects = projects.filter(
    (project) => project.status === 'completed'
  ).length;

  const completionRate =
    projects.length === 0
      ? 0
      : Math.round(
          (completedProjects / projects.length) * 100
        );

  const subscriptionRevenueKsh =
    subscriptions.reduce(
      (sum, subscription) =>
        sum + subscription.feeKsh,
      0
    );

  const platformCommissionKsh =
    payments.reduce(
      (sum, payment) =>
        sum + payment.commissionKsh,
      0
    );

  const escrowHeldKsh =
    payments
      .filter((payment) => payment.status === 'held')
      .reduce(
        (sum, payment) =>
          sum + payment.amountKsh,
        0
      );

  const subscriptionsNeedingRenewal =
    subscriptions.filter(
      (subscription) =>
        subscription.status === 'expiring_soon' ||
        subscription.status === 'expired'
    ).length;

  const openDisputes = disputes.filter(
    (dispute) => dispute.status !== 'resolved'
  ).length;

  return {
    totalProjects: projects.length,
    completedProjects,
    completionRate,
    subscriptionRevenueKsh,
    platformCommissionKsh,
    totalRevenueKsh:
      subscriptionRevenueKsh +
      platformCommissionKsh,
    escrowHeldKsh,
    subscriptionsNeedingRenewal,
    openDisputes,
    totalUsers: users.length,
    totalProfessionals: professionals.length,
  };
}
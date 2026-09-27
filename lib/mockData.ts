// Simulated platform data for the admin dashboard prototype.
// No real backend yet - mirrors the entities used in the Flutter client app
// (users, architect tiers, projects, bids, escrow, disputes, reviews).

export type Tier = 'Diamond' | 'Gold' | 'Silver' | 'Bronze';

export const tierFees: Record<Tier, number> = {
  Diamond: 4999,
  Gold: 3999,
  Silver: 1999,
  Bronze: 499,
};

export const tierCommission: Record<Tier, number> = {
  Diamond: 0.2,
  Gold: 0.25,
  Silver: 0.3,
  Bronze: 0.35,
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Client' | 'Architect' | 'Admin';
  location: string;
  joined: string;
  status: 'Active' | 'Suspended';
}

export const users: AdminUser[] = [
  { id: 'u1', name: 'David Otieno', email: 'david.otieno@example.com', role: 'Client', location: 'Karen, Nairobi', joined: '2026-06-14', status: 'Active' },
  { id: 'u2', name: 'Grace Nyambura', email: 'grace.n@example.com', role: 'Client', location: 'Kisumu', joined: '2026-07-02', status: 'Active' },
  { id: 'u3', name: 'Jane Mwangi', email: 'jane.mwangi@example.com', role: 'Architect', location: 'Karen, Nairobi', joined: '2026-05-20', status: 'Active' },
  { id: 'u4', name: 'Peter Kamau', email: 'peter.kamau@example.com', role: 'Architect', location: 'Nakuru', joined: '2026-06-01', status: 'Active' },
  { id: 'u5', name: 'Aisha Hassan', email: 'aisha.hassan@example.com', role: 'Architect', location: 'Mombasa', joined: '2026-08-11', status: 'Suspended' },
  { id: 'u6', name: 'Samuel Otieno', email: 'sam.otieno@example.com', role: 'Client', location: 'Homa Bay', joined: '2026-09-01', status: 'Active' },
];

export interface AdminProfessional {
  id: string;
  name: string;
  firmName: string;
  tier: Tier;
  boraqsVerified: boolean;
  location: string;
  rating: number;
  completedProjects: number;
}

export const professionals: AdminProfessional[] = [
  { id: 'u3', name: 'Jane Mwangi', firmName: 'Mwangi & Associates Architects', tier: 'Gold', boraqsVerified: true, location: 'Karen, Nairobi', rating: 4.8, completedProjects: 41 },
  { id: 'u4', name: 'Peter Kamau', firmName: 'Kamau Design Studio', tier: 'Diamond', boraqsVerified: true, location: 'Nakuru', rating: 4.6, completedProjects: 63 },
  { id: 'u5', name: 'Aisha Hassan', firmName: 'Coastal Architecture Collective', tier: 'Silver', boraqsVerified: false, location: 'Mombasa', rating: 4.1, completedProjects: 12 },
  { id: 'u7', name: 'Brian Kiptoo', firmName: 'Student Portfolio - UoN', tier: 'Bronze', boraqsVerified: false, location: 'Nairobi', rating: 4.4, completedProjects: 5 },
];

export interface AdminProject {
  id: string;
  title: string;
  clientName: string;
  category: string;
  location: string;
  budgetMinKsh: number;
  budgetMaxKsh: number;
  status: 'Open for Bids' | 'In Progress' | 'Completed' | 'Disputed';
}

export const projects: AdminProject[] = [
  { id: 'proj-1', title: 'Modern 4-Bedroom Eco-Villa with Solar Design', clientName: 'David Otieno', category: 'Residential House Plans', location: 'Karen, Nairobi', budgetMinKsh: 150000, budgetMaxKsh: 250000, status: 'In Progress' },
  { id: 'proj-2', title: 'Kisumu Lakeside Office Complex', clientName: 'Grace Nyambura', category: 'Commercial & Office Complexes', location: 'Kisumu', budgetMinKsh: 400000, budgetMaxKsh: 600000, status: 'Open for Bids' },
  { id: 'proj-3', title: 'Homa Bay Rental Units Renovation', clientName: 'Samuel Otieno', category: 'Renovation & Structural Extension', location: 'Homa Bay', budgetMinKsh: 90000, budgetMaxKsh: 140000, status: 'Completed' },
];

export interface AdminBid {
  id: string;
  projectTitle: string;
  architectName: string;
  tier: Tier;
  amountKsh: number;
  deliveryDays: number;
  status: 'Submitted' | 'Accepted' | 'Rejected';
}

export const bids: AdminBid[] = [
  { id: 'b1', projectTitle: 'Modern 4-Bedroom Eco-Villa with Solar Design', architectName: 'Jane Mwangi', tier: 'Gold', amountKsh: 200000, deliveryDays: 14, status: 'Accepted' },
  { id: 'b2', projectTitle: 'Kisumu Lakeside Office Complex', architectName: 'Peter Kamau', tier: 'Diamond', amountKsh: 520000, deliveryDays: 30, status: 'Submitted' },
  { id: 'b3', projectTitle: 'Kisumu Lakeside Office Complex', architectName: 'Aisha Hassan', tier: 'Silver', amountKsh: 470000, deliveryDays: 35, status: 'Submitted' },
];

export interface AdminPayment {
  id: string;
  projectTitle: string;
  clientName: string;
  architectName: string;
  amountKsh: number;
  commissionKsh: number;
  method: 'Bank Transfer';
  status: 'Held in Escrow' | 'Released' | 'Refunded';
  date: string;
}

export const payments: AdminPayment[] = [
  { id: 'p1', projectTitle: 'Modern 4-Bedroom Eco-Villa - Stage 1', clientName: 'David Otieno', architectName: 'Jane Mwangi', amountKsh: 60000, commissionKsh: 15000, method: 'Bank Transfer', status: 'Released', date: '2026-09-10' },
  { id: 'p2', projectTitle: 'Modern 4-Bedroom Eco-Villa - Stage 2', clientName: 'David Otieno', architectName: 'Jane Mwangi', amountKsh: 60000, commissionKsh: 15000, method: 'Bank Transfer', status: 'Held in Escrow', date: '2026-09-18' },
  { id: 'p3', projectTitle: 'Homa Bay Rental Units - Full Payment', clientName: 'Samuel Otieno', architectName: 'Peter Kamau', amountKsh: 120000, commissionKsh: 24000, method: 'Bank Transfer', status: 'Released', date: '2026-08-30' },
];

export interface AdminSubscription {
  id: string;
  architectName: string;
  tier: Tier;
  feeKsh: number;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  renewalDate: string;
}

export const subscriptions: AdminSubscription[] = [
  { id: 's1', architectName: 'Jane Mwangi', tier: 'Gold', feeKsh: 3999, status: 'Active', renewalDate: '2027-05-20' },
  { id: 's2', architectName: 'Peter Kamau', tier: 'Diamond', feeKsh: 4999, status: 'Expiring Soon', renewalDate: '2026-10-05' },
  { id: 's3', architectName: 'Aisha Hassan', tier: 'Silver', feeKsh: 1999, status: 'Active', renewalDate: '2027-08-11' },
  { id: 's4', architectName: 'Brian Kiptoo', tier: 'Bronze', feeKsh: 499, status: 'Expired', renewalDate: '2026-08-01' },
];

export interface AdminDispute {
  id: string;
  caseId: string;
  projectTitle: string;
  clientName: string;
  architectName: string;
  issueType: string;
  escrowAmountKsh: number;
  status: 'Open' | 'Under Review' | 'Resolved';
  description: string;
}

export const disputes: AdminDispute[] = [
  { id: 'd1', caseId: 'DISP-4471', projectTitle: 'Kisumu Lakeside Office Complex', clientName: 'Grace Nyambura', architectName: 'Peter Kamau', issueType: 'Deliverable Quality / Scope Discrepancy', escrowAmountKsh: 156000, status: 'Under Review', description: 'Client reports submitted drawings do not match the agreed floor plan revisions.' },
];

export interface AdminReview {
  id: string;
  clientName: string;
  architectName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Published' | 'Flagged';
}

export const reviews: AdminReview[] = [
  { id: 'r1', clientName: 'David Otieno', architectName: 'Jane Mwangi', rating: 5, comment: 'Excellent communication and the final design exceeded our brief.', date: '2026-08-12', status: 'Published' },
  { id: 'r2', clientName: 'Samuel Otieno', architectName: 'Peter Kamau', rating: 4, comment: 'Great work overall, milestone updates could have been faster.', date: '2026-09-02', status: 'Published' },
];

export const platformStats = {
  totalUsers: users.length,
  clients: users.filter((u) => u.role === 'Client').length,
  professionals: users.filter((u) => u.role === 'Architect').length,
  activeProjects: projects.filter((p) => p.status === 'In Progress' || p.status === 'Open for Bids').length,
  completedProjects: projects.filter((p) => p.status === 'Completed').length,
  openDisputes: disputes.filter((d) => d.status !== 'Resolved').length,
  subscriptionRevenueKsh: subscriptions.reduce((sum, s) => sum + s.feeKsh, 0),
  platformCommissionKsh: payments.reduce((sum, p) => sum + p.commissionKsh, 0),
};

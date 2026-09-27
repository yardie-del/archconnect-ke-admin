const COLOR_MAP: Record<string, string> = {
  Active: 'bg-mpesaGreen/10 text-mpesaGreen',
  Published: 'bg-mpesaGreen/10 text-mpesaGreen',
  Accepted: 'bg-mpesaGreen/10 text-mpesaGreen',
  Released: 'bg-mpesaGreen/10 text-mpesaGreen',
  Resolved: 'bg-mpesaGreen/10 text-mpesaGreen',
  Completed: 'bg-mpesaGreen/10 text-mpesaGreen',
  'In Progress': 'bg-sky-100 text-sky-700',
  Submitted: 'bg-sky-100 text-sky-700',
  'Open for Bids': 'bg-sky-100 text-sky-700',
  'Held in Escrow': 'bg-amber-100 text-amber-700',
  'Expiring Soon': 'bg-amber-100 text-amber-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  Suspended: 'bg-kenyaRed/10 text-kenyaRed',
  Rejected: 'bg-kenyaRed/10 text-kenyaRed',
  Refunded: 'bg-kenyaRed/10 text-kenyaRed',
  Expired: 'bg-kenyaRed/10 text-kenyaRed',
  Disputed: 'bg-kenyaRed/10 text-kenyaRed',
  Flagged: 'bg-kenyaRed/10 text-kenyaRed',
  Open: 'bg-kenyaRed/10 text-kenyaRed',
};

export default function Badge({ label }: { label: string }) {
  const cls = COLOR_MAP[label] ?? 'bg-slate-100 text-slate-600';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{label}</span>;
}

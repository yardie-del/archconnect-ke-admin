export default function StatCard({
  label,
  value,
  accent = 'text-slateDark',
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}

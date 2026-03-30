import { MetricCardProps } from '@/types';

export default function MetricCard({ label, value, note, status = 'neutral' }: MetricCardProps) {
  const valueColor =
    status === 'positive'
      ? 'text-green-600 dark:text-green-400'
      : status === 'negative'
        ? 'text-red-600 dark:text-red-400'
        : 'text-slate-800 dark:text-slate-100';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {note && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{note}</p>}
    </div>
  );
}

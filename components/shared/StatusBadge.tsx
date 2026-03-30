import { StatusBadgeProps } from '@/types';

export default function StatusBadge({
  positive,
  positiveLabel = '正のレバレッジ ✓',
  negativeLabel = '負のレバレッジ ✗',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
        positive
          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
      }`}
    >
      {positive ? positiveLabel : negativeLabel}
    </span>
  );
}

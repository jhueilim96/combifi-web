'use client';

import { SplitDetailSectionProps } from './types';
import SplitDetails from '../SplitDetails';
import { formatCurrencyAmount } from '@/lib/currencyUtils';

// Expanded content - reuses existing SplitDetails component
export function SplitDetailExpanded({ record }: SplitDetailSectionProps) {
  return <SplitDetails record={record} />;
}

// Collapsed content - one-liner summary
export function SplitDetailCollapsed({ record }: SplitDetailSectionProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        {formatCurrencyAmount(record.amount, record.currency)}
      </span>
      <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
        {record.description || 'Untitled Split'}
      </span>
    </div>
  );
}

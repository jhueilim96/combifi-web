'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SplitDetailSectionProps } from './types';
import SplitDetails from '../SplitDetails';
import { formatCurrencyAmount } from '@/lib/currencyUtils';

// Format short date like "24 Oct"
function formatShortDate(date: string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  return `${day} ${month}`;
}

// Expanded content - reuses existing SplitDetails component
export function SplitDetailExpanded({ record }: SplitDetailSectionProps) {
  return <SplitDetails record={record} />;
}

// Collapsed content - amount, description, date, and optional image thumbnail
export function SplitDetailCollapsed({
  record,
  onImageClick,
}: SplitDetailSectionProps & { onImageClick?: () => void }) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Get first transaction image URL if available
  const imageUrl =
    record.transaction_images && record.transaction_images.length > 0
      ? record.transaction_images[0]?.image_url
      : null;

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl font-bold text-gray-900 dark:text-white flex-shrink-0">
          {formatCurrencyAmount(record.amount, record.currency)}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
          {record.description || 'Untitled Split'}
        </span>
        <span className="text-gray-400 dark:text-gray-500 text-xs flex-shrink-0">
          {formatShortDate(record.date)}
        </span>
      </div>

      {/* Image thumbnail */}
      {imageUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onImageClick?.();
          }}
          className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative"
        >
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={12} className="animate-spin text-gray-400" />
            </div>
          )}
          <Image
            src={imageUrl}
            alt="Receipt"
            width={32}
            height={32}
            className={`object-cover w-full h-full transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            unoptimized={true}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </button>
      )}
    </div>
  );
}

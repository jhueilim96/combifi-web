import { formatCurrency, formatAmountOnly } from '@/lib/currencyUtils';
import React, { useState } from 'react';
import Image from 'next/image';
import { Loader2, Scale, Users, UserCog, NotebookPen } from 'lucide-react';
import { InstantSplitDetailedView } from '@/lib/viewTypes';

interface SplitDetailsProps {
  record: InstantSplitDetailedView;
}

// Format date as "24 Oct · FRIDAY"
function formatSplitDate(date: string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const weekday = d
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase();
  return `${day} ${month} · ${weekday}`;
}

// Get settle mode display info
function getSettleModeInfo(mode: string | null): {
  label: string;
  icon: React.ReactNode;
} {
  switch (mode) {
    case 'PERPAX':
      return { label: 'SPLIT EVENLY', icon: <Scale size={14} /> };
    case 'FRIEND':
      return { label: 'CUSTOM SPLIT', icon: <Users size={14} /> };
    case 'HOST':
      return { label: 'HOST MANAGED', icon: <UserCog size={14} /> };
    default:
      return { label: 'SPLIT', icon: <Scale size={14} /> };
  }
}

// Extract emoji from description if present, otherwise return default
function getCategoryEmoji(description: string | null): string {
  if (!description) return '💸';
  // Match emoji at start of string or anywhere in string
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  const match = description.match(emojiRegex);
  return match ? match[0] : '💸';
}

const NOTES_TRUNCATE_LENGTH = 20;

export default function SplitDetails({ record }: SplitDetailsProps) {
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [isEnlargedImageLoading, setIsEnlargedImageLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showFullNotes, setShowFullNotes] = useState(false);

  const emoji = getCategoryEmoji(record.description);

  // Get first transaction image URL if available
  const imageUrl =
    record.transaction_images && record.transaction_images.length > 0
      ? record.transaction_images[0]?.image_url
      : null;

  const isNotesTruncated =
    record.notes && record.notes.length > NOTES_TRUNCATE_LENGTH;
  const displayedNotes =
    isNotesTruncated && !showFullNotes
      ? record.notes!.slice(0, NOTES_TRUNCATE_LENGTH) + '...'
      : record.notes;

  return (
    <div className="flex flex-col items-center text-center pt-1 pb-4">
      {/* Category emoji square */}
      <div
        className={`w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 ${imageUrl ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (imageUrl) {
            setShowEnlargedImage(true);
            setIsEnlargedImageLoading(true);
          }
        }}
      >
        <span className="text-3xl">{emoji}</span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
        {record.description || 'Untitled Split'}
      </h2>

      {/* Date and status */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {formatSplitDate(record.date)}
      </p>

      {/* Amount */}
      <div className="flex items-start justify-center gap-0.5 mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
          {formatCurrency(record.currency)}
        </span>
        <span className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-wide">
          {formatAmountOnly(record.amount, record.currency)}
        </span>
      </div>

      {/* Settle mode badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mb-4">
        {getSettleModeInfo(record.settle_mode).icon}
        <span className="text-xs font-semibold tracking-wide">
          {getSettleModeInfo(record.settle_mode).label}
        </span>
      </div>

      {/* Paid by */}
      {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        @ Paid by {hostName}
      </p> */}

      {/* Image and Notes row */}
      {(imageUrl || record.notes) && (
        <div className="flex items-center justify-center gap-6">
          {/* Image preview */}
          {imageUrl && (
            <button
              onClick={() => {
                setShowEnlargedImage(true);
                setIsEnlargedImageLoading(true);
              }}
              className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative">
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
                  className={`object-cover w-full h-full transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                  unoptimized={true}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              </div>
              <span className="text-sm">Image</span>
            </button>
          )}

          {/* Notes preview/expanded */}
          {record.notes && (
            <button
              onClick={() =>
                isNotesTruncated && setShowFullNotes(!showFullNotes)
              }
              className={`flex items-center gap-2 text-gray-400 dark:text-gray-500 transition-colors ${isNotesTruncated ? 'hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer' : 'cursor-default'}`}
            >
              <NotebookPen size={16} className="flex-shrink-0" />
              <span className="text-sm text-left">{displayedNotes}</span>
            </button>
          )}
        </div>
      )}

      {/* Enlarged image modal */}
      {showEnlargedImage && imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setShowEnlargedImage(false)}
        >
          <div className="relative w-[90vw] h-[90vh] max-w-[600px] max-h-[600px]">
            {isEnlargedImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-white" />
              </div>
            )}
            <Image
              src={imageUrl}
              alt="Enlarged Receipt Photo"
              fill
              className={`object-contain transition-opacity duration-300 ${isEnlargedImageLoading ? 'opacity-0' : 'opacity-100'}`}
              unoptimized={true}
              onLoad={() => setIsEnlargedImageLoading(false)}
              onError={() => setIsEnlargedImageLoading(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { Tables } from '@/lib/database.types';
import {
  formatLocalDateTime,
  PerPaxMetadata,
  retrieveSettleMetadata,
} from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { FileText, Users, Loader2 } from 'lucide-react';

interface SplitDetailsProps {
  record: Tables<'one_time_split_expenses'>;
}
export default function SplitDetails({ record }: SplitDetailsProps) {
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isEnlargedImageLoading, setIsEnlargedImageLoading] = useState(false);

  const toggleEnlargedImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEnlargedImage(!showEnlargedImage);
    if (!showEnlargedImage) {
      setIsEnlargedImageLoading(true);
    }
  };
  const numberOfPax =
    record.settle_mode === 'PERPAX'
      ? retrieveSettleMetadata<PerPaxMetadata>(record).numberOfPax
      : 0;
  const hasExtraInfo = record.settle_mode === 'PERPAX' || record.notes;
  return (
    <div className="border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col space-y-4 mb-6">
      <div className="flex justify-between items-center space-x-6">
        <div className="text-left overflow-hidden">
          <h2 className="text-sm text-gray-700 dark:text-gray-300 font-normal cursor-pointer">
            {record.description || 'Untitled Split'}
          </h2>

          <div className="flex items-baseline cursor-pointer">
            <span className="text-[2.5rem] font-semibold text-gray-800 dark:text-gray-200 tracking-tight truncate overflow-hidden">
              {formatCurrencyAmount(record.amount, record.currency)}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {formatLocalDateTime(record.date)}
            </span>
          </div>
        </div>
        <div className="w-24 h-24 overflow-hidden rounded-lg border border-indigo-50 flex flex-col justify-center items-center relative">
          {record.file_url ? (
            <>
              {/* Loading indicator for main image */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <Loader2 size={24} className="animate-spin text-indigo-400" />
                </div>
              )}

              <Image
                src={record.file_url}
                alt="Receipt Photo"
                width={200}
                height={200}
                className={`object-cover w-full h-full cursor-pointer transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                onClick={toggleEnlargedImage}
                unoptimized={true} // For S3 signed URLs
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />

              {showEnlargedImage && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
                  onClick={() => setShowEnlargedImage(false)}
                >
                  <div className="relative w-[90vw] h-[90vh] max-w-[600px] max-h-[600px]">
                    {/* Loading indicator for enlarged image */}
                    {isEnlargedImageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2
                          size={32}
                          className="animate-spin text-white"
                        />
                      </div>
                    )}

                    <Image
                      src={record.file_url}
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
            </>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-full">
              <Image
                src="/logo.svg"
                alt="No Image"
                width={40}
                height={40}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Additional content section with single top border */}
      {hasExtraInfo && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
          {/* Number of participants if split evenly */}
          {record.settle_mode === 'PERPAX' && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Users size={20} color="grey" />
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of People:
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {numberOfPax}
                </div>
              </div>
            </div>
          )}

          {/* Notes section */}
          {record.notes && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <FileText size={20} color="grey" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                  {record.notes}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

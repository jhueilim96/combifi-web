import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { Tables } from '@/lib/database.types';
import {
  formatLocalDateTime,
  PerPaxMetadata,
  retrieveSettleMetadata,
} from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { X, FileText, Users } from 'lucide-react';

interface SplitDetailsProps {
  record: Tables<'one_time_split_expenses'>;
}
export default function SplitDetails({ record }: SplitDetailsProps) {
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const toggleEnlargedImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEnlargedImage(!showEnlargedImage);
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
        <div
          className={`${
            showEnlargedImage
              ? 'w-full h-auto min-h-[300px] transition-all duration-300 absolute top-0 right-0 z-10 bg-white dark:bg-gray-800 p-4 shadow-xl rounded-xl'
              : 'w-24 h-24'
          } overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col justify-center items-center relative`}
        >
          {record.file_url ? (
            <>
              <Image
                src={record.file_url}
                alt="Receipt Photo"
                width={200}
                height={200}
                className={`${showEnlargedImage ? 'object-contain max-h-[400px]' : 'object-cover'} w-full h-full cursor-pointer transition-all duration-300`}
                onClick={toggleEnlargedImage}
                unoptimized={true} // For S3 signed URLs
              />
              {showEnlargedImage && (
                <button
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={toggleEnlargedImage}
                >
                  <X size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
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

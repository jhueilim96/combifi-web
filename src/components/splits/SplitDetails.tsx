import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { Tables } from '@/lib/database.types';
import { formatLocalDateTime } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

interface SplitDetailsProps {
  record: Tables<'one_time_split_expenses'>;
}
export default function SplitDetails({ record }: SplitDetailsProps) {
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const toggleEnlargedImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEnlargedImage(!showEnlargedImage);
  };
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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

      {/* Notes section - integrated into main content */}
      {record.notes && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-500 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
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
        </div>
      )}
    </div>
  );
}

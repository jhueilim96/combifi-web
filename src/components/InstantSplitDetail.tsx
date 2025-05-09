import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { Tables } from '@/lib/database.types';
import { useState } from 'react';

interface InstantSplitDetailProps {
  record: Tables<'one_time_split_expenses'>;
}
export default function InstantSplitDetail({
  record,
}: InstantSplitDetailProps) {
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
              {record.date
                ? new Date(record.date as string).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : ''}
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
              <img
                src={record.file_url}
                alt="Receipt Photo"
                width={200}
                height={200}
                className={`${showEnlargedImage ? 'object-contain max-h-[400px]' : 'object-cover'} w-full h-full cursor-pointer transition-all duration-300`}
                onClick={toggleEnlargedImage}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <p className="text-gray-400 dark:text-gray-500 text-[0.75rem] font-extralight">
                No Image
              </p>
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

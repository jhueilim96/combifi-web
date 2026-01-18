import { X, Check } from 'lucide-react';

interface PaymentStatusButtonGroupProps {
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
  label?: string;
}

export default function PaymentStatusButtonGroup({
  markAsPaid,
  setMarkAsPaid,
}: PaymentStatusButtonGroupProps) {
  return (
    <div className="flex justify-center py-2">
      {/* Segmented Control - iOS style */}
      <div className="relative inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {/* Sliding Active Indicator */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-gray-700 rounded-md shadow-sm transition-all duration-200 ease-out ${
            markAsPaid ? 'left-[calc(50%+2px)]' : 'left-1'
          }`}
        />

        {/* Buttons */}
        <button
          type="button"
          onClick={() => setMarkAsPaid(false)}
          className="relative flex items-center gap-1.5 px-5 py-1.5 text-sm font-medium transition-colors duration-200 z-10"
        >
          <X
            size={14}
            strokeWidth={2.5}
            className={
              !markAsPaid
                ? 'text-red-500 dark:text-red-400'
                : 'text-gray-400 dark:text-gray-500'
            }
          />
          <span
            className={
              !markAsPaid
                ? 'text-gray-700 dark:text-gray-200'
                : 'text-gray-500 dark:text-gray-400'
            }
          >
            Unpaid
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMarkAsPaid(true)}
          className="relative flex items-center gap-1.5 px-5 py-1.5 text-sm font-medium transition-colors duration-200 z-10"
        >
          <Check
            size={14}
            strokeWidth={2.5}
            className={
              markAsPaid
                ? 'text-green-500 dark:text-green-400'
                : 'text-gray-400 dark:text-gray-500'
            }
          />
          <span
            className={
              markAsPaid
                ? 'text-gray-700 dark:text-gray-200'
                : 'text-gray-500 dark:text-gray-400'
            }
          >
            Paid
          </span>
        </button>
      </div>
    </div>
  );
}

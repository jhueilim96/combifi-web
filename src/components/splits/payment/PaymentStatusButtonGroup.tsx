import { SquareCheckBig } from 'lucide-react';

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
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <SquareCheckBig
            size={18}
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Have you already paid?
        </p>
      </div>

      {/* Payment Toggle - ButtonGroup Style */}
      <div className="w-4/5 mx-auto">
        <div className="flex">
          <button
            type="button"
            onClick={() => setMarkAsPaid(false)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 border rounded-l-lg shadow ${
              !markAsPaid
                ? 'bg-gray-100/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-gray-500 dark:border-gray-500 hover:bg-gray-50/50'
                : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span
              className={`${!markAsPaid ? 'font-bold text-gray-700 dark:text-gray-300' : ''}`}
            >
              NOT YET
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMarkAsPaid(true)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 shadow border rounded-r-lg ${
              markAsPaid
                ? 'bg-green-100/50 dark:bg-green-900/30 text-gray-900 dark:text-gray-100 border-green-600 dark:border-green-500 hover:bg-green-50/50'
                : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span
              className={`${markAsPaid ? 'font-bold text-green-700 dark:text-green-400' : ''}`}
            >
              YES
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

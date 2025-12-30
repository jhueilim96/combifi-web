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
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMarkAsPaid(false)}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 border rounded-lg ${
            !markAsPaid
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-500 dark:border-orange-600 shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
          }`}
        >
          Not Yet
        </button>
        <button
          type="button"
          onClick={() => setMarkAsPaid(true)}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 border rounded-lg ${
            markAsPaid
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-500 dark:border-green-600 shadow-sm'
              : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
          }`}
        >
          Yes, Paid
        </button>
      </div>
    </div>
  );
}

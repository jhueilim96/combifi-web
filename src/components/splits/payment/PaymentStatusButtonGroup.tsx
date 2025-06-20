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
      <div className="flex space-x-3 items-center text-gray-600 dark:text-gray-400 mb-4">
        <SquareCheckBig size={20} color="grey" />
        <span>Have you already paid?</span>
      </div>

      {/* Payment Toggle - ButtonGroup Style */}
      <div className="w-4/5 mx-auto">
        <div className="flex">
          <button
            type="button"
            onClick={() => setMarkAsPaid(false)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-stone-50/50 border rounded-l-lg shadow ${
              !markAsPaid
                ? 'bg-stone-100/50 text-gray-900 border-stone-500'
                : 'bg-white text-gray-400 border-stone-200'
            }`}
          >
            <span
              className={`${!markAsPaid ? 'font-bold text-stone-500' : ''}`}
            >
              NOT YET
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMarkAsPaid(true)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-green-50/50 shadow border rounded-r-lg ${
              markAsPaid
                ? 'bg-green-100/50 text-gray-900 border-green-600'
                : 'bg-white text-gray-400 border-stone-200'
            }`}
          >
            <span className={`${markAsPaid ? 'font-bold text-green-700' : ''}`}>
              YES
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

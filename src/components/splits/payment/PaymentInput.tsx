import { formatCurrency, formatCurrencyAmount } from '@/lib/currencyUtils';
import { formatLocalDateTime } from '@/lib/utils';
import { CircleUser, Coins, Wallet } from 'lucide-react';

interface PaymentInstructionsProps {
  date: string; // Optional date when payment was requested
  name: string;
  remainingAmount: number;
  currency: string;
  instructions?: string; // Optional payment instructions
  validationError: {
    name: string | null;
    amount: string | null;
    generic: string | null;
  };
  participantAmount: string; // Amount entered by the participant
  handleAmountChange: (amount: string) => void; // Function to handle amount change
}

export default function PaymentInput({
  date,
  name,
  remainingAmount,
  currency,
  instructions,
  validationError,
  participantAmount,
  handleAmountChange,
}: PaymentInstructionsProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
      {/* Header section */}
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
          <CircleUser size={20} className="text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Payment requested{' '}
            {formatLocalDateTime(date) ? `on ${formatLocalDateTime(date)}` : ''}
          </div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {name}
          </div>
        </div>
      </div>

      {/* Payment instructions if provided */}
      {instructions && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 mb-2">
            <Wallet
              size={20}
              className="text-indigo-500 dark:text-indigo-400"
            />
            <span>Payment Instructions</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
            {instructions}
          </div>
        </div>
      )}

      {/* Amount info section */}
      <div className="mt-5">
        <div className="flex space-x-3 items-center text-gray-600 dark:text-gray-400 mb-2">
          <Coins size={20} className="text-indigo-500 dark:text-indigo-400" />
          <span>
            How much is your portion? [Remaining:{' '}
            {formatCurrencyAmount(remainingAmount, currency)}]
          </span>
        </div>
      </div>

      {/* Amount input field */}
      <div className="relative mb-4">
        <div
          className={`absolute inset-y-0 left-0 pl-3 ${validationError['amount'] ? 'pb-6' : ''} flex items-center pointer-events-none`}
        >
          <span className="text-gray-500 text-lg">
            {formatCurrency(currency)}
          </span>
        </div>
        <input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          min={0}
          className={`w-full px-4 py-5 pl-10 border ${
            validationError['amount']
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white text-4xl dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
          value={participantAmount}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
        {validationError['amount'] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {validationError['amount']}
          </p>
        )}
      </div>
    </div>
  );
}

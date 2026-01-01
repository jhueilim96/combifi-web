import { formatCurrencyAmount } from '@/lib/currencyUtils';

interface AmountDisplayProps {
  name: string;
  currency: string;
  amount: string | number;
}

export default function AmountDisplay({
  name,
  currency,
  amount,
}: AmountDisplayProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
      <div className="text-center">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          {name}, you should pay
        </p>
        <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
          {formatCurrencyAmount(amount, currency)}
        </p>
      </div>
    </div>
  );
}

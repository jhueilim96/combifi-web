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
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {name}, you should pay
        </p>
        <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
          {formatCurrencyAmount(amount, currency)}
        </p>
      </div>
    </div>
  );
}

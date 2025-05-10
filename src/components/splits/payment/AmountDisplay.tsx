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
    <div className="border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6 bg-white dark:bg-gray-800">
      <div className="text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {name}, you should pay
        </p>
        <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
          {formatCurrencyAmount(amount, currency)}
        </p>
      </div>
    </div>
  );
}

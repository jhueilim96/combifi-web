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
    <div className="flex justify-center pt-4 pb-2">
      {/* Slim Segmented Control */}
      <div className="relative inline-flex bg-gray-100 dark:bg-gray-800/50 rounded-full p-0.5">
        {/* Sliding Indicator */}
        <div
          className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full transition-all duration-300 ease-out ${
            markAsPaid
              ? 'left-[calc(50%+1px)] bg-indigo-100 dark:bg-indigo-900/40'
              : 'left-0.5 bg-white dark:bg-gray-700'
          }`}
        />

        {/* Buttons */}
        <button
          type="button"
          onClick={() => setMarkAsPaid(false)}
          className={`relative px-5 py-1.5 text-xs font-medium transition-colors duration-200 rounded-full z-10 ${
            !markAsPaid
              ? 'text-gray-700 dark:text-gray-200'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          Unpaid
        </button>
        <button
          type="button"
          onClick={() => setMarkAsPaid(true)}
          className={`relative px-5 py-1.5 text-xs font-medium transition-colors duration-200 rounded-full z-10 ${
            markAsPaid
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          Paid
        </button>
      </div>
    </div>
  );
}

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
    <div className="mb-6">
      {/* Sliding Toggle */}
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-full p-1">
        {/* Sliding Indicator */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-gray-700 rounded-full shadow-sm transition-all duration-300 ease-in-out ${
            markAsPaid ? 'left-[calc(50%+2px)]' : 'left-1'
          }`}
        />

        {/* Buttons */}
        <div className="relative flex">
          <button
            type="button"
            onClick={() => setMarkAsPaid(false)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-full z-10 ${
              !markAsPaid
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Unpaid
          </button>
          <button
            type="button"
            onClick={() => setMarkAsPaid(true)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-full z-10 ${
              markAsPaid
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Paid
          </button>
        </div>
      </div>
    </div>
  );
}

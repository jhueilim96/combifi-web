interface PaymentStatusProps {
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
}
export default function PaymentStatus({
  markAsPaid,
  setMarkAsPaid,
}: PaymentStatusProps) {
  return (
    <div
      className={`mt-4 shadow-lg border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-xl ${
        markAsPaid
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200  bg-white dark:bg-gray-800 hover:border-gray-300'
      }`}
      onClick={() => setMarkAsPaid(!markAsPaid)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full ${markAsPaid ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center mr-3`}
          >
            {markAsPaid ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`font-semibold ${markAsPaid ? 'text-green-600' : 'text-gray-800'}`}
            >
              {markAsPaid ? 'Payment Confirmed' : 'Tap to Mark as Paid'}
            </span>
            {markAsPaid ? (
              <span className="text-sm text-green-500">
                Successfully marked as paid ✓
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                Click here once payment is complete
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

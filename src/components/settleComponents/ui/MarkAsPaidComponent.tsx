interface MarkAsPaidComponentProps {
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
}
export default function MarkAsPaidComponent({
  markAsPaid,
  setMarkAsPaid,
}: MarkAsPaidComponentProps) {
  return (
    <div
      className="mt-4 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800"
      onClick={() => setMarkAsPaid(!markAsPaid)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full ${markAsPaid ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'} flex items-center justify-center mr-3`}
          >
            {markAsPaid ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 dark:text-green-300"
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
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
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
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            Mark as paid
          </span>
        </div>
      </div>
    </div>
  );
}

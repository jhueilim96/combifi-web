import { Check, Clock } from 'lucide-react';

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
              <Check size={20} className="text-green-500" />
            ) : (
              <Clock size={20} className="text-gray-500" />
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

'use client';

import { QrCode, Landmark, Check, Clock } from 'lucide-react';
import { PaymentSectionProps } from './types';
import ListPaymentMethods from '../payment/ListPaymentMethods';
import PaymentStatusButtonGroup from '../payment/PaymentStatusButtonGroup';

// Expanded content - payment method selection + mark as paid
export function PaymentExpanded({
  record,
  setSelectedPaymentMethod,
  markAsPaid,
  setMarkAsPaid,
  selectedParticipant,
}: Omit<PaymentSectionProps, 'selectedPaymentMethod'>) {
  const hasPaymentMethods =
    record.payment_methods && record.payment_methods.length > 0 && record.name;

  return (
    <div>
      {/* Payment Methods Section */}
      {hasPaymentMethods && (
        <ListPaymentMethods
          paymentMethods={record.payment_methods!}
          hostName={record.name!}
          onPaymentMethodChange={setSelectedPaymentMethod}
          initialPaymentMethodLabel={
            (
              selectedParticipant?.payment_method_metadata as {
                label?: string;
              } | null
            )?.label
          }
        />
      )}

      {/* No payment methods message */}
      {!hasPaymentMethods && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No payment methods available</p>
        </div>
      )}

      {/* Payment Status Button Group */}
      <PaymentStatusButtonGroup
        markAsPaid={markAsPaid}
        setMarkAsPaid={setMarkAsPaid}
      />
    </div>
  );
}

// Collapsed content - selected payment method summary
export function PaymentCollapsed({
  selectedPaymentMethod,
  markAsPaid,
}: Pick<PaymentSectionProps, 'selectedPaymentMethod' | 'markAsPaid'>) {
  // Determine icon based on payment method type
  const PaymentIcon = () => {
    if (!selectedPaymentMethod) {
      return <Clock size={16} className="text-gray-400" />;
    }
    if (selectedPaymentMethod.type === 'IMAGE') {
      return <QrCode size={16} className="text-gray-600 dark:text-gray-400" />;
    }
    return <Landmark size={16} className="text-gray-600 dark:text-gray-400" />;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PaymentIcon />
        {selectedPaymentMethod ? (
          <span className="text-gray-900 dark:text-white font-medium text-sm">
            {selectedPaymentMethod.label}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            No payment method selected
          </span>
        )}
      </div>
      <div
        className={`flex items-center gap-1.5 text-sm font-medium ${
          markAsPaid
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {markAsPaid ? (
          <>
            <Check size={14} />
            <span>Paid</span>
          </>
        ) : (
          <span>Unpaid</span>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import SubmitButton from '../payment/SubmitButton';
import PaymentStatusButtonGroup from '../payment/PaymentStatusButtonGroup';
import ListPaymentMethods, {
  SelectedPaymentMethod,
} from '../payment/ListPaymentMethods';
import useValidationError from '@/hooks/useValidationError';
import { PerPaxMetadata, retrieveSettleMetadata } from '@/lib/utils';
import { formatCurrency } from '@/lib/currencyUtils';
import { InstantSplitDetailedView } from '@/lib/viewTypes';

interface SplitPerPaxProps {
  record: InstantSplitDetailedView;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  newParticipantName: string;
  handleUpdateRecord: () => Promise<void>;
  setParticipantAmount: (amount: string) => void;
  participantAmount: string;
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
  handleBack: () => void;
  setSelectedPaymentMethod: (method: SelectedPaymentMethod | null) => void;
}

export default function SplitPerPax({
  record,
  selectedParticipant,
  handleUpdateRecord,
  setParticipantAmount,
  participantAmount,
  markAsPaid,
  handleBack,
  setMarkAsPaid,
  setSelectedPaymentMethod,
}: SplitPerPaxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { validationError, updateValidationError, resetValidationError } =
    useValidationError();

  // Calculate fixed per person amount from metadata when the component mounts
  useEffect(() => {
    try {
      const perPaxAmount =
        retrieveSettleMetadata<PerPaxMetadata>(record).perPaxAmount;
      const amount = parseFloat(perPaxAmount).toFixed(2);
      setParticipantAmount(amount);
    } catch (error) {
      console.error('Error accessing metadata:', error);
    }
  }, [record, setParticipantAmount]);

  const handleSubmit = async () => {
    // Reset any existing validation errors
    resetValidationError();
    setIsLoading(true);
    try {
      await handleUpdateRecord();
    } catch (error) {
      console.error('Error updating record:', error);
      if (error instanceof Error) {
        updateValidationError('generic', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors mb-6"
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        <span className="text-sm font-medium">Name List</span>
      </button>

      {/* YOUR AMOUNT separator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Your Amount
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Amount display (read-only) */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-start">
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1 mr-0.5">
            {formatCurrency(record.currency)}
          </span>
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            {participantAmount || '0.00'}
          </span>
        </div>
      </div>

      {/* Mode indicator */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        Amount split evenly
      </p>

      {/* COMPLETE PAYMENT separator */}
      <div className="flex items-center gap-4 mt-12 mb-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Complete Payment
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Payment Methods Section */}
      {record.payment_methods &&
        record.payment_methods.length > 0 &&
        record.name && (
          <ListPaymentMethods
            paymentMethods={record.payment_methods}
            hostName={record.name}
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

      {/* Mark as Paid toggle */}
      <PaymentStatusButtonGroup
        markAsPaid={markAsPaid}
        setMarkAsPaid={setMarkAsPaid}
      />

      <SubmitButton
        handleBack={handleBack}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isUpdate={!!selectedParticipant}
        validationError={validationError}
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import SubmitButton from '../payment/SubmitButton';
import PaymentStatusButtonGroup from '../payment/PaymentStatusButtonGroup';
import ListPaymentMethods, {
  SelectedPaymentMethod,
} from '../payment/ListPaymentMethods';
import useValidationError from '@/hooks/useValidationError';
import AmountDisplay from '../payment/AmountDisplay';
import { PerPaxMetadata, retrieveSettleMetadata } from '@/lib/utils';
import { Scale, ChevronLeft } from 'lucide-react';

interface SplitPerPaxProps {
  record: Tables<'one_time_split_expenses'>;
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
  newParticipantName,
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
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-6 mt-6">
      <div className="relative text-center space-y-2 mb-6">
        <button
          onClick={handleBack}
          className="absolute left-0 top-0 p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2 pt-1">
          <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-indigo-900/50 flex items-center justify-center">
             <Scale size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          Split Evenly
        </div>
      </div>

      <div className="space-y-6">
        {/* Updated UI - Card showing who should pay what */}
        <AmountDisplay
          name={newParticipantName}
          currency={record.currency}
          amount={participantAmount}
        />

        {/* Payment Methods Section */}
        {record.profiles?.payment_methods &&
          record.profiles?.payment_methods.length > 0 &&
          record.profiles?.name && (
            <ListPaymentMethods
              paymentMethods={record.profiles.payment_methods}
              hostName={record.profiles.name}
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
          validationError={validationError}
        />
      </div>
    </div>
  );
}

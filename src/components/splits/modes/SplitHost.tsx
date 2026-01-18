'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import SubmitButton from '../payment/SubmitButton';
import useValidationError from '@/hooks/useValidationError';
import PaymentStatusButtonGroup from '../payment/PaymentStatusButtonGroup';
import ListPaymentMethods, {
  SelectedPaymentMethod,
} from '../payment/ListPaymentMethods';
import { formatCurrency } from '@/lib/currencyUtils';
import { InstantSplitDetailedView } from '@/lib/viewTypes';

interface SplitHostProps {
  record: InstantSplitDetailedView;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  handleUpdateRecord: () => Promise<void>;
  setParticipantAmount: (amount: string) => void;
  participantAmount: string;
  participants: Tables<'one_time_split_expenses_participants'>[];
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
  handleBack: () => void;
  setSelectedPaymentMethod: (method: SelectedPaymentMethod | null) => void;
}

export default function SplitHost({
  record,
  selectedParticipant,
  setParticipantAmount,
  handleUpdateRecord,
  participantAmount,
  markAsPaid,
  setMarkAsPaid,
  handleBack,
  setSelectedPaymentMethod,
}: SplitHostProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { validationError } = useValidationError();

  // When component mounts, use the amount that the host has assigned to this participant
  useEffect(() => {
    if (selectedParticipant) {
      // Use the amount that the host has already assigned
      setParticipantAmount(selectedParticipant.amount.toFixed(2));
    } else {
      // If no participant is selected (which shouldn't happen in HOST mode),
      // set amount to 0 as a fallback
      setParticipantAmount('0.00');
      console.warn('No participant selected in HOST mode');
    }
  }, [selectedParticipant, setParticipantAmount]);

  const handleSubmit = async () => {
    if (
      !participantAmount ||
      Number.isNaN(Number(participantAmount)) ||
      Number(participantAmount) <= 0
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await handleUpdateRecord();
    } catch (error) {
      console.error('Error updating amount:', error);
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
        Amount set by host
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

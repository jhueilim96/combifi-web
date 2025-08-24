'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import SubmitButton from '../payment/SubmitButton';
import useValidationError from '@/hooks/useValidationError';
import PaymentStatusButtonGroup from '../payment/PaymentStatusButtonGroup';
import TabbedPaymentMethods from '../payment/TabbedPaymentMethods';
import AmountDisplay from '../payment/AmountDisplay';
import { Crown } from 'lucide-react';

interface SplitHostProps {
  record: Tables<'one_time_split_expenses'>;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  handleUpdateRecord: () => Promise<void>;
  setParticipantAmount: (amount: string) => void;
  participantAmount: string;
  participants: Tables<'one_time_split_expenses_participants'>[];
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
  handleBack: () => void;
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
      <div className="text-center space-y-2 mb-6">
        <div className="text-2xl font-medium text-gray-800 dark:text-gray-200 flex items-center justify-center">
          <Crown
            size={24}
            className="mr-2 text-amber-600 dark:text-amber-400"
          />
          Host Assigned Split
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {record.profiles.name} has determined how much each person should pay
        </p>
      </div>

      <div className="space-y-6">
        {/* Updated UI - Card showing who should pay what */}
        <AmountDisplay
          name={selectedParticipant?.name || ''}
          currency={record.currency}
          amount={selectedParticipant?.amount.toFixed(2) || '0.00'}
        />

        {/* Payment Methods Section */}
        {record.profiles?.payment_methods &&
          record.profiles?.payment_methods.length > 0 &&
          record.profiles?.name && (
            <TabbedPaymentMethods
              paymentMethods={record.profiles.payment_methods}
              hostName={record.profiles.name}
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

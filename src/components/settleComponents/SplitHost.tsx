'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import SubmitGroupButton from './ui/SubmitGroupButton';
import useValidationError from '@/hooks/useValidationError';
import MarkAsPaidComponent from './ui/MarkAsPaidComponent';
import QRComponent from './ui/QRComponent';
import FixedAmountComponent from './ui/FixedAmountComponent';

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
      <div className="text-center space-y-2 mb-4">
        <div className="text-2xl font-medium text-gray-800 dark:text-gray-200">
          <span className="mr-2">👑</span>
          Host Assigned Split
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {record.profiles.name} has determined how much each person should pay
        </p>
      </div>

      <div className="space-y-4">
        {/* Updated UI - Card showing who should pay what */}
        <FixedAmountComponent
          name={selectedParticipant?.name || ''}
          currency={record.currency}
          amount={selectedParticipant?.amount.toFixed(2) || '0.00'}
        />

        {/* QR Code Section */}
        {record.profiles?.qr_url && record.profiles?.name && (
          <QRComponent
            name={record.profiles.name}
            qrUrl={record.profiles.qr_url}
          />
        )}
        {/* Mark as Paid toggle */}
        <MarkAsPaidComponent
          markAsPaid={markAsPaid}
          setMarkAsPaid={setMarkAsPaid}
        />

        <SubmitGroupButton
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          validationError={validationError}
        />
      </div>
    </div>
  );
}

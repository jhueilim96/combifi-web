'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import SubmitGroupButton from './ui/SubmitGroupButton';
import MarkAsPaidComponent from './ui/MarkAsPaidComponent';
import QRComponent from './ui/QRComponent';
import useValidationError from '@/hooks/useValidationError';
import FixedAmountComponent from './ui/FixedAmountComponent';

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
}

export default function SplitPerPax({
  record,
  newParticipantName,
  handleUpdateRecord,
  setParticipantAmount,
  participantAmount,
  markAsPaid,
  handleBack,
  setMarkAsPaid,
}: SplitPerPaxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { validationError, updateValidationError, resetValidationError } =
    useValidationError();

  // Calculate fixed per person amount from metadata when the component mounts
  useEffect(() => {
    if (record.settle_metadata) {
      try {
        const metadata = record.settle_metadata as Record<string, unknown>;
        if (
          metadata.perPaxAmount &&
          typeof metadata.perPaxAmount === 'string'
        ) {
          const amount = parseFloat(metadata.perPaxAmount).toFixed(2);
          setParticipantAmount(amount);
        }
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
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
    <div className="border border-gray-50 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
      <div className="text-center space-y-2 mb-4">
        <div className="text-2xl font-medium text-gray-800 dark:text-gray-200">
          <span className="mr-2">⚖️</span>
          Split Evenly
        </div>
      </div>

      <div className="space-y-4">
        {/* Updated UI - Card showing who should pay what */}
        <FixedAmountComponent
          name={newParticipantName}
          currency={record.currency}
          amount={participantAmount}
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

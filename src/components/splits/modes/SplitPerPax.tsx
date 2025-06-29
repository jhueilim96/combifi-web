'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import SubmitButton from '../payment/SubmitButton';
import PaymentStatusButtonGroup from '../payment/PaymentStatusButtonGroup';
import QRCode from '../payment/QRCode';
import useValidationError from '@/hooks/useValidationError';
import AmountDisplay from '../payment/AmountDisplay';
import { PerPaxMetadata, retrieveSettleMetadata } from '@/lib/utils';
import { Scale } from 'lucide-react';

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
    <div className="border border-gray-50 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
      <div className="text-center space-y-2 mb-6">
        <div className="text-2xl font-medium text-gray-800 dark:text-gray-200 flex items-center justify-center">
          <Scale
            size={24}
            className="mr-2 text-indigo-600 dark:text-indigo-400"
          />
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

        {/* QR Code Section */}
        {record.profiles?.qr_url && record.profiles?.name && (
          <QRCode name={record.profiles.name} qrUrl={record.profiles.qr_url} />
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

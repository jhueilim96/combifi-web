'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import { participantInputSchema } from '@/lib/validations';
import QRComponent from './ui/QRComponent';
import MarkAsPaidComponent from './ui/MarkAsPaidComponent';
import SubmitGroupButton from './ui/SubmitGroupButton';
import useValidationError from '@/hooks/useValidationError';
import InputPortionWithPaymentInstructions from './ui/InputPortionWithPaymentInstructions';
import { FriendMetadata, retrieveSettleMetadata } from '@/lib/utils';

interface SplitFriendProps {
  record: Tables<'one_time_split_expenses'>;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  newParticipantName: string;
  setNewParticipantName: (name: string) => void;
  handleUpdateRecord: () => Promise<void>;
  setParticipantAmount: (amount: string) => void;
  participantAmount: string;
  participants: Tables<'one_time_split_expenses_participants'>[];
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
  handleBack: () => void;
}

export default function SplitFriend({
  record,
  selectedParticipant,
  newParticipantName,
  handleUpdateRecord,
  setParticipantAmount,
  participantAmount,
  participants,
  markAsPaid,
  setMarkAsPaid,
  handleBack,
}: SplitFriendProps) {
  const [isLoading, setIsLoading] = useState(false);
  const initialBalance = selectedParticipant
    ? selectedParticipant.amount
    : record.amount;
  const [balance, setBalance] = useState(initialBalance);
  const [totalContributed, setTotalContributed] = useState(0);
  const {
    validationError,
    updateValidationError,
    resetValidationError,
    handleValidation,
  } = useValidationError();

  const input = {
    name: newParticipantName,
    amount: participantAmount,
  };
  const validateionSchema = participantInputSchema;
  const paymentInstruction =
    retrieveSettleMetadata<FriendMetadata>(record).paymentInstruction;

  const handleAmountChange = (amount: string) => {
    setParticipantAmount(amount);
    handleValidation(input, 'amount', amount, validateionSchema);
  };

  useEffect(() => {
    // Calculate total amount that's already been contributed
    const sum = participants
      .filter((p) => !p.is_host) // Exclude host from calculation
      .reduce((acc, participant) => acc + participant.amount, 0);

    setTotalContributed(sum);
  }, [participants]);

  useEffect(() => {
    // Update balance when participantAmount changes
    const inputAmount = Number(participantAmount) || 0;
    const remaining = Math.max(record.amount - totalContributed, 0);

    // If there's a selected participant, subtract their existing contribution
    const existingAmount = selectedParticipant ? selectedParticipant.amount : 0;
    const adjustedRemaining = remaining + existingAmount;

    setBalance(adjustedRemaining - inputAmount);
  }, [participantAmount, record.amount, totalContributed, selectedParticipant]);

  const handleSubmit = async () => {
    // Reset any existing validation errors
    resetValidationError();

    if (
      Number.isNaN(Number(participantAmount)) ||
      Number(participantAmount) <= 0
    ) {
      updateValidationError('amount', 'Amount must be greater than zero');
      return;
    }

    setIsLoading(true);
    try {
      await handleUpdateRecord();
    } catch (error) {
      console.error('Error updating amount:', error);
      if (error instanceof Error) {
        updateValidationError('generic', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the remaining amount to be paid (excluding current user's contribution)
  const remainingAmount = Math.max(record.amount - totalContributed, 0);
  // If there's a selected participant, add back their amount to show the true remaining
  const displayRemainingAmount = selectedParticipant
    ? remainingAmount + selectedParticipant.amount
    : remainingAmount;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
      <div className="text-center space-y-2 mb-4">
        <div className="text-2xl font-medium text-gray-800 dark:text-gray-200">
          <span className="mr-2">💰</span>
          Pay What You Spend
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You pick how much to pay for this expense. View the remaining balance
          and enter your portion.
        </p>
      </div>

      <div className="space-y-4">
        <InputPortionWithPaymentInstructions
          date={record.created_at}
          name={newParticipantName}
          remainingAmount={displayRemainingAmount}
          currency={record.currency}
          instructions={paymentInstruction}
          validationError={validationError}
          balance={balance}
          participantAmount={participantAmount}
          handleAmountChange={handleAmountChange}
          displayRemainingAmount={displayRemainingAmount}
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

        {/* Validation error message */}
        {validationError['generic'] && (
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg mb-2">
            {validationError['generic']}
          </div>
        )}

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

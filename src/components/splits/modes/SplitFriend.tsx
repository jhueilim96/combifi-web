'use client';

import { useState, useEffect } from 'react';
import { HandCoins, Coins, Wallet } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import { participantInputSchema } from '@/lib/validations';
import SubmitButton from '../payment/SubmitButton';
import useValidationError from '@/hooks/useValidationError';
import { FriendMetadata, retrieveSettleMetadata } from '@/lib/utils';
import { formatCurrency, formatCurrencyAmount } from '@/lib/currencyUtils';
import QRCode from '../payment/QRCode';
import PaymentStatusButtonGroup from '../payment/PaymentStatusButtonGroup';

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
    const sum = participants.reduce(
      (acc, participant) => acc + participant.amount,
      0
    );

    setTotalContributed(sum);
  }, [participants]);

  useEffect(() => {}, [
    participantAmount,
    record.amount,
    totalContributed,
    selectedParticipant,
  ]);

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
  const remainingAmount = Math.max(
    record.amount - totalContributed - (parseFloat(participantAmount) || 0),
    0
  );
  // If there's a selected participant, add back their amount to show the true remaining
  const displayRemainingAmount = selectedParticipant
    ? remainingAmount + selectedParticipant.amount
    : remainingAmount;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
      {/* Pay What You Spend Header + Description */}
      <div className="text-center space-y-2 mb-6">
        <div className="text-2xl font-medium text-gray-800 dark:text-gray-200 flex items-center justify-center">
          <HandCoins
            size={24}
            className="mr-2 text-indigo-500 dark:text-indigo-400"
          />
          Pay What You Spend
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You pick how much to pay for this expense. View the remaining balance
          and enter your portion.
        </p>
      </div>

      <div className="space-y-6">
        {/* Amount Info and Input Field Section */}
        <div>
          <div className="flex space-x-3 items-center text-gray-600 dark:text-gray-400 mb-3">
            <Coins size={20} color="grey" />
            <span>
              {newParticipantName}, Enter Your Portion [Remaining:{' '}
              {formatCurrencyAmount(displayRemainingAmount, record.currency)}]
            </span>
          </div>

          {/* Amount input field */}
          <div className="relative">
            <div
              className={`absolute inset-y-0 left-0 pl-3 ${validationError['amount'] ? 'pb-6' : ''} flex items-center pointer-events-none`}
            >
              <span className="text-gray-500 text-lg">
                {formatCurrency(record.currency)}
              </span>
            </div>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              min={0}
              className={`w-full px-4 py-5 pl-10 border ${
                validationError['amount']
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white text-4xl dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              value={participantAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {validationError['amount'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationError['amount']}
              </p>
            )}
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentInstruction && (
          <div>
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 mb-2">
              <Wallet size={20} color="grey" />
              <span>Payment Instructions</span>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {paymentInstruction}
            </div>
          </div>
        )}

        {/* Payment Methods Section */}
        {record.profiles?.payment_methods &&
          record.profiles?.payment_methods.length > 0 &&
          record.profiles?.name && (
            <div className="space-y-3">
              {record.profiles?.payment_methods.map(
                (
                  paymentMethod: Tables<'one_time_split_expenses'>['profiles']['payment_methods'][number],
                  index: number
                ) =>
                  paymentMethod.image_url && (
                    <QRCode
                      key={index}
                      name={`${record.profiles.name} - ${paymentMethod.provider}`}
                      qrUrl={paymentMethod.image_url}
                    />
                  )
              )}
            </div>
          )}

        {/* Payment Status Button Group */}
        <PaymentStatusButtonGroup
          markAsPaid={markAsPaid}
          setMarkAsPaid={setMarkAsPaid}
        />

        {/* Validation error message */}
        {validationError['generic'] && (
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg">
            {validationError['generic']}
          </div>
        )}

        {/* Submit Button */}
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

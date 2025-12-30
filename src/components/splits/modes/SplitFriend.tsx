'use client';

import { useState, useEffect } from 'react';
import { HandCoins, Coins, Wallet } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import { participantInputSchema } from '@/lib/validations';
import SubmitButton from '../payment/SubmitButton';
import useValidationError from '@/hooks/useValidationError';
import { FriendMetadata, retrieveSettleMetadata } from '@/lib/utils';
import { formatCurrency, formatCurrencyAmount } from '@/lib/currencyUtils';
import TabbedPaymentMethods from '../payment/TabbedPaymentMethods';
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
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-6 mt-6">
      {/* Pay What You Spend Header + Description */}
      <div className="text-center space-y-2 mb-6">
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-indigo-900/50 flex items-center justify-center">
            <HandCoins
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          Pay What You Spend
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Choose your portion of the expense. The remaining balance updates as
          you type.
        </p>
      </div>

      <div className="space-y-6">
        {/* Amount Info and Input Field Section */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Coins size={18} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Enter Your Portion
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Remaining:{' '}
                <span className="font-semibold">
                  {formatCurrencyAmount(
                    displayRemainingAmount,
                    record.currency
                  )}
                </span>
              </p>
            </div>
          </div>

          {/* Amount input field */}
          <div className="relative">
            <div
              className={`absolute inset-y-0 left-0 pl-4 ${validationError['amount'] ? 'pb-6' : ''} flex items-center pointer-events-none`}
            >
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                {formatCurrency(record.currency)}
              </span>
            </div>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              min={0}
              className={`w-full px-4 py-5 pl-12 border rounded-lg transition-colors text-4xl ${
                validationError['amount']
                  ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              } text-gray-900 dark:text-gray-100`}
              value={participantAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {validationError['amount'] && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {validationError['amount']}
              </p>
            )}
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentInstruction && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Wallet
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Payment Instructions
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 whitespace-pre-line text-sm">
              {paymentInstruction}
            </div>
          </div>
        )}

        {/* Payment Methods Section */}
        {record.profiles?.payment_methods &&
          record.profiles?.payment_methods.length > 0 &&
          record.profiles?.name && (
            <TabbedPaymentMethods
              paymentMethods={record.profiles.payment_methods}
              hostName={record.profiles.name}
            />
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

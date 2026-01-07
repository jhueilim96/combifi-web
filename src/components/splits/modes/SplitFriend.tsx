'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowLeft } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import { participantInputSchema } from '@/lib/validations';
import SubmitButton from '../payment/SubmitButton';
import useValidationError from '@/hooks/useValidationError';
import { FriendMetadata, retrieveSettleMetadata } from '@/lib/utils';
import { formatCurrency, formatCurrencyAmount } from '@/lib/currencyUtils';
import ListPaymentMethods, {
  SelectedPaymentMethod,
} from '../payment/ListPaymentMethods';
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
  setSelectedPaymentMethod: (method: SelectedPaymentMethod | null) => void;
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
  setSelectedPaymentMethod,
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
    console.log('friend submit');
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
      console.log('friend submit done');
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

      {/* ENTER YOUR AMOUNT separator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Enter Your Amount
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Amount input */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <span className="absolute right-full top-1 mr-0.5 text-sm font-medium text-gray-400 dark:text-gray-500">
            {formatCurrency(record.currency)}
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={participantAmount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, '');
              handleAmountChange(value);
            }}
            className="text-5xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none text-center w-40"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Remaining amount */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-6">
        Remaining:{' '}
        {formatCurrencyAmount(displayRemainingAmount, record.currency)}
      </p>

      {/* Validation error */}
      {validationError['amount'] && (
        <p className="text-center text-sm text-red-600 dark:text-red-400 mb-4">
          {validationError['amount']}
        </p>
      )}

      {/* Payment Instructions - similar style to notes */}
      {paymentInstruction && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <Wallet size={16} className="flex-shrink-0" />
            <span className="text-sm">{paymentInstruction}</span>
          </div>
        </div>
      )}

      {/* COMPLETE PAYMENT separator */}
      <div className="flex items-center gap-4 mt-12 mb-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Complete Payment
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

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

      {/* Payment Status Button Group */}
      <PaymentStatusButtonGroup
        markAsPaid={markAsPaid}
        setMarkAsPaid={setMarkAsPaid}
      />

      {/* Validation error message */}
      {validationError['generic'] && (
        <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg mt-4">
          {validationError['generic']}
        </div>
      )}

      {/* Submit Button */}
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

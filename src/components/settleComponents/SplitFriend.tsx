'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import { formatCurrency, formatCurrencyAmount } from '@/lib/currencyUtils';
import { participantInputSchema } from '@/lib/validations';
import QRComponent from './ui/QRComponent';
import MarkAsPaidComponent from './ui/MarkAsPaidComponent';
import SubmitGroupButton from './ui/SubmitGroupButton';
import useValidationError from '@/hooks/useValidationError';

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
  setNewParticipantName,
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
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Friend Split
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          You can adjust your amount and confirm payment
        </p>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Total Amount:
          </span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrencyAmount(record.amount, record.currency)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Remaining to Pay:
          </span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrencyAmount(displayRemainingAmount, record.currency)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name field for updating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={newParticipantName}
            onChange={(e) => {
              setNewParticipantName(e.target.value);
              // Clear validation error when user starts typing again
              handleValidation(
                input,
                'name',
                e.target.value,
                validateionSchema
              );
            }}
            placeholder="Enter your name"
          />
          {validationError['name'] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {validationError['name']}
            </p>
          )}
        </div>

        {/* Amount field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Share Amount
          </label>
          <div className="relative">
            <div
              className={`absolute inset-y-0 left-0 pl-3 ${validationError['amount'] || balance < 0 ? 'pb-6' : ''} flex items-center pointer-events-none`}
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
              className={`w-full px-3 py-1 pl-10 border ${
                validationError['amount'] || balance < 0
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              value={participantAmount}
              onChange={(e) => {
                setParticipantAmount(e.target.value);
                handleValidation(
                  input,
                  'amount',
                  e.target.value,
                  validateionSchema
                );
              }}
            />
            {validationError['amount'] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationError['amount']}
              </p>
            )}
            {balance < 0 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-4000">
                Your amount exceeds the remaining balance:{' '}
                {formatCurrencyAmount(displayRemainingAmount, record.currency)}
              </p>
            )}
          </div>
        </div>
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

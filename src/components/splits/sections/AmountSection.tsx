'use client';

import { useEffect, useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';

const INSTRUCTION_TRUNCATE_LENGTH = 20;
import { AmountSectionProps } from './types';
import { formatCurrency, formatCurrencyAmount } from '@/lib/currencyUtils';
import {
  FriendMetadata,
  PerPaxMetadata,
  retrieveSettleMetadata,
} from '@/lib/utils';
import { participantInputSchema } from '@/lib/validations';
import useValidationError from '@/hooks/useValidationError';

// Expanded content - handles all three modes
export function AmountExpanded({
  record,
  participantAmount,
  setParticipantAmount,
  selectedParticipant,
  participants,
  newParticipantName,
  onProceed,
}: AmountSectionProps) {
  const settleMode = record.settle_mode;
  const { validationError, handleValidation } = useValidationError();
  const [showFullInstruction, setShowFullInstruction] = useState(false);

  // Calculate total contributed for FRIEND mode
  const totalContributed = useMemo(() => {
    return participants.reduce(
      (acc, participant) => acc + participant.amount,
      0
    );
  }, [participants]);

  // Initialize amount based on mode
  useEffect(() => {
    if (settleMode === 'PERPAX') {
      try {
        const perPaxAmount =
          retrieveSettleMetadata<PerPaxMetadata>(record).perPaxAmount;
        const amount = parseFloat(perPaxAmount).toFixed(2);
        setParticipantAmount(amount);
      } catch (error) {
        console.error('Error accessing PERPAX metadata:', error);
      }
    } else if (settleMode === 'HOST' && selectedParticipant) {
      setParticipantAmount(selectedParticipant.amount.toFixed(2));
    }
  }, [record, settleMode, selectedParticipant, setParticipantAmount]);

  // Get payment instruction for FRIEND mode
  const paymentInstruction =
    settleMode === 'FRIEND'
      ? retrieveSettleMetadata<FriendMetadata>(record).paymentInstruction
      : null;

  const isInstructionTruncated =
    paymentInstruction &&
    paymentInstruction.length > INSTRUCTION_TRUNCATE_LENGTH;
  const displayedInstruction =
    isInstructionTruncated && !showFullInstruction
      ? paymentInstruction.slice(0, INSTRUCTION_TRUNCATE_LENGTH) + '...'
      : paymentInstruction;

  // Calculate remaining amount for FRIEND mode
  const remainingAmount = useMemo(() => {
    if (settleMode !== 'FRIEND') return 0;
    const remaining = Math.max(
      record.amount - totalContributed - (parseFloat(participantAmount) || 0),
      0
    );
    // If editing existing participant, add back their amount
    return selectedParticipant
      ? remaining + selectedParticipant.amount
      : remaining;
  }, [
    settleMode,
    record.amount,
    totalContributed,
    participantAmount,
    selectedParticipant,
  ]);

  // Handle amount change for FRIEND mode
  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    setParticipantAmount(cleanValue);
    handleValidation(
      { name: newParticipantName, amount: cleanValue },
      'amount',
      cleanValue,
      participantInputSchema
    );
  };

  // Handle proceed to next section
  const handleProceed = () => {
    if (settleMode === 'FRIEND') {
      const amount = parseFloat(participantAmount);
      if (isNaN(amount) || amount <= 0) {
        // Trigger validation to show error message
        handleValidation(
          { name: newParticipantName, amount: participantAmount },
          'amount',
          participantAmount,
          participantInputSchema
        );
        return;
      }
    }
    onProceed();
  };

  // Mode indicator text
  const getModeText = () => {
    switch (settleMode) {
      case 'PERPAX':
        return 'Amount split evenly';
      case 'HOST':
        return 'Amount set by host';
      default:
        return null;
    }
  };

  const isEditable = settleMode === 'FRIEND';

  return (
    <div>
      {/* Amount display/input */}
      <div className="flex justify-center mb-4">
        <div className="relative flex items-start">
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1 mr-0.5">
            {formatCurrency(record.currency)}
          </span>
          {isEditable ? (
            <input
              type="text"
              inputMode="decimal"
              value={participantAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-5xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none text-center w-40"
              placeholder="0.00"
            />
          ) : (
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              {participantAmount || '0.00'}
            </span>
          )}
        </div>
      </div>

      {/* Mode indicator or remaining amount */}
      {settleMode === 'FRIEND' ? (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-4">
          Remaining: {formatCurrencyAmount(remainingAmount, record.currency)}
        </p>
      ) : (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          {getModeText()}
        </p>
      )}

      {/* Validation error */}
      {validationError['amount'] && (
        <p className="text-center text-sm text-red-600 dark:text-red-400 mb-4">
          {validationError['amount']}
        </p>
      )}

      {/* Payment Instructions for FRIEND mode - collapsed */}
      {paymentInstruction && !showFullInstruction && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() =>
              isInstructionTruncated && setShowFullInstruction(true)
            }
            className={`flex items-center gap-2 text-gray-400 dark:text-gray-500 transition-colors ${isInstructionTruncated ? 'hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer' : 'cursor-default'}`}
          >
            <Wallet size={16} className="flex-shrink-0" />
            <span className="text-sm text-left">
              {displayedInstruction}
              {isInstructionTruncated && (
                <span className="text-indigo-500 dark:text-indigo-400 ml-1">
                  Expand
                </span>
              )}
            </span>
          </button>
        </div>
      )}

      {/* Payment Instructions expanded */}
      {paymentInstruction && showFullInstruction && (
        <button
          onClick={() => setShowFullInstruction(false)}
          className="w-full mb-4 cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <Wallet size={16} />
              <span className="text-xs font-semibold tracking-wider uppercase">
                Payment Instruction
              </span>
            </div>
            <div className="max-h-[22.5rem] overflow-y-auto w-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap text-center">
                {paymentInstruction}
              </p>
            </div>
            <span className="text-xs text-indigo-500 dark:text-indigo-400">
              Collapse
            </span>
          </div>
        </button>
      )}

      {/* Continue button */}
      <button
        type="button"
        onClick={handleProceed}
        className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
      >
        Continue to Payment
      </button>
    </div>
  );
}

// Collapsed content - just shows the amount (center aligned)
export function AmountCollapsed({
  participantAmount,
  record,
}: Pick<AmountSectionProps, 'participantAmount' | 'record'>) {
  return (
    <div className="flex items-center justify-center">
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mr-0.5">
        {formatCurrency(record.currency)}
      </span>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        {participantAmount || '0.00'}
      </span>
    </div>
  );
}

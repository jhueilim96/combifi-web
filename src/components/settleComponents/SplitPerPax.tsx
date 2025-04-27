'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';

interface SplitPerPaxProps {
  record: Tables<'one_time_split_expenses'>;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  newParticipantName: string;
  setNewParticipantName: (name: string) => void;
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
  setNewParticipantName,
  handleUpdateRecord,
  setParticipantAmount,
  participantAmount,
  markAsPaid,
  handleBack,
  setMarkAsPaid
}: SplitPerPaxProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Calculate fixed per person amount from metadata when the component mounts
  useEffect(() => {
    let amount = 0;

    if (record.settle_metadata) {
      try {
        const metadata = record.settle_metadata as Record<string, unknown>;
        if (metadata.perPaxAmount && typeof metadata.perPaxAmount === 'number') {
          amount = metadata.perPaxAmount;
        }
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    }

    // If perPaxAmount isn't in metadata, fall back to dividing the total amount
    if (amount === 0) {
      // Assuming at least 2 people for the split
      amount = record.amount / 2;
    }
    setParticipantAmount(amount.toFixed(2));
  }, [record, setParticipantAmount]);

  const handleSubmit = async () => {
    if (!participantAmount || Number.isNaN(Number(participantAmount)) || Number(participantAmount) <= 0) {
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
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Per Person Split</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          The amount is fixed per person
        </p>
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
            onChange={(e) => setNewParticipantName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Display fixed amount - not editable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Share Amount (Fixed)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input
              type="text"
              className="w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-75 cursor-not-allowed"
              value={participantAmount}
              disabled
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This amount is fixed per person and cannot be changed
          </p>
        </div>

        {/* Mark as Paid toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="markAsPaid"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={markAsPaid}
            onChange={(e) => setMarkAsPaid(e.target.checked)}
          />
          <label htmlFor="markAsPaid" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Mark as paid
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg mt-2"
            onClick={() => {
              handleBack();
            }}
          >
            Back
          </button>

          <button
            className={`w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg mt-2`}
            onClick={handleSubmit}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

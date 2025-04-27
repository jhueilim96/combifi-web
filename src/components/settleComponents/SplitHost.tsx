'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';

interface SplitHostProps {
  record: Tables<'one_time_split_expenses'>;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  participantName: string;
  onUpdateAmount: () => Promise<void>;
  setParticipantAmount: (amount: string) => void;
  participantAmount: string;
}

export default function SplitHost({ 
  record, 
  selectedParticipant, 
  participantName, 
  onUpdateAmount, 
  setParticipantAmount,
  participantAmount 
}: SplitHostProps) {
  const [isLoading, setIsLoading] = useState(false);
  
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
    if (!participantAmount || Number.isNaN(Number(participantAmount)) || Number(participantAmount) <= 0) {
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateAmount();
    } catch (error) {
      console.error('Error updating amount:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
        Assigned Amount
      </h3>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Total Expense:</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">${record.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Your Assigned Share:</span>
          <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">${participantAmount}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Amount (Set by Host)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            id="amount"
            type="text"
            placeholder="0.00"
            className="pl-8 w-full p-3 text-lg font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-500"
            value={participantAmount}
            disabled
          />
        </div>
      </div>
      
      <button
        className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg mb-2"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Confirming...' : 'Confirm Payment'}
      </button>
      
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
        Hi <b>{participantName}</b>, the host has assigned you to pay ${participantAmount}
      </p>
    </div>
  );
}

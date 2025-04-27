'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';

interface SplitPerPaxProps {
  record: Tables<'one_time_split_expenses'>;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  participantName: string;
  onUpdateAmount: () => Promise<void>;
  setParticipantAmount: (amount: string) => void;
  participantAmount: string;
}

export default function SplitPerPax({ 
  record, 
  selectedParticipant, 
  participantName, 
  onUpdateAmount, 
  setParticipantAmount,
  participantAmount 
}: SplitPerPaxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [perPaxAmount, setPerPaxAmount] = useState<number>(0);
  
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
    
    setPerPaxAmount(amount);
    setParticipantAmount(amount.toFixed(2));
  }, [record, setParticipantAmount]);

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
        Fixed Per Person Split
      </h3>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Total Amount:</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">${record.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Your Fixed Share:</span>
          <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">${perPaxAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Amount (Fixed)
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
        {isLoading ? 'Updating...' : 'Confirm Amount'}
      </button>
      
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
        Hi <b>{participantName}</b>, this expense has a fixed per-person amount of ${perPaxAmount.toFixed(2)}
      </p>
    </div>
  );
}

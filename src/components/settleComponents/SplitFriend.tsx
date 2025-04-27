'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';

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
  const initialBalance = selectedParticipant ? selectedParticipant.amount : record.amount;
  const [balance, setBalance] = useState(initialBalance);
  const [totalContributed, setTotalContributed] = useState(0);

  useEffect(() => {
    // Calculate total amount that's already been contributed
    const sum = participants
      .filter(p => !p.is_host) // Exclude host from calculation
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setParticipantAmount(value);
  };

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

  // Calculate the remaining amount to be paid (excluding current user's contribution)
  const remainingAmount = Math.max(record.amount - totalContributed, 0);
  // If there's a selected participant, add back their amount to show the true remaining
  const displayRemainingAmount = selectedParticipant 
    ? remainingAmount + selectedParticipant.amount 
    : remainingAmount;

return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
        <div className="text-center space-y-2 mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Friend Split</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
            You can adjust your amount and confirm payment
            </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Total Amount:</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">${record.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Remaining to Pay:</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">${displayRemainingAmount.toFixed(2)}</span>
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
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="Enter your name"
            />
            </div>
            
            {/* Amount field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Share Amount
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8 w-full p-3 text-lg font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-500"
                        value={participantAmount}
                        onChange={handleAmountChange}
                    />
                </div>
                {balance < 0 && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                        Your amount exceeds the remaining balance. Max contribution: ${displayRemainingAmount.toFixed(2)}
                    </div>
                )}
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
                    className={`w-full py-3 px-4 ${
                        balance < 0 || isLoading
                            ? 'bg-indigo-200 cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600'
                    } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg mt-2`}
                    disabled={balance < 0 || isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? 'Processing...' : 'Confirm'}
                </button>
            </div>
            {/* <button
            className={`w-full py-3 px-4 ${
              balance < 0 || isLoading
                ? 'bg-indigo-200 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg mt-2`}
            disabled={balance < 0 || isLoading}
            onClick={handleSubmit}
            >
            {isLoading ? 'Processing...' : 'Confirm'}
            </button> */}
        </div>
    </div>
)
}

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
        {/* QR Code Section */}
        {record.profiles?.qr_url && (
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scan to Pay
            </label>
            <div className="flex justify-center bg-white p-4 rounded-lg">
              <img
                src={record.profiles.qr_url}
                alt="Payment QR Code"
                width={200}
                height={200}
                className="rounded"
                style={{ maxHeight: '200px', width: 'auto' }}
              />
            </div>
            <div className="mt-2">
              <a
                href={record.profiles.qr_url}
                download="payment-qr-code.png"
                className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
              </a>
            </div>
          </div>
        )}
        {/* Mark as Paid toggle */}
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800"
          onClick={() => setMarkAsPaid(!markAsPaid)}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${markAsPaid ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'} flex items-center justify-center mr-3`}>
                {markAsPaid ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-800 dark:text-gray-200 font-medium">Mark as paid</span>
            </div>
          </div>
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
            className={`w-full py-3 px-4 ${balance < 0 || isLoading
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

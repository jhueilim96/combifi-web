'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';
import { Button } from '../ui/Button';
import { formatCurrency } from '@/lib/currencyUtils';

interface SplitPerPaxProps {
  record: Tables<'one_time_split_expenses'>;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  newParticipantName: string;
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
  handleUpdateRecord,
  setParticipantAmount,
  participantAmount,
  markAsPaid,
  handleBack,
  setMarkAsPaid
}: SplitPerPaxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate fixed per person amount from metadata when the component mounts
  useEffect(() => {
    if (record.settle_metadata) {
      try {
        const metadata = record.settle_metadata as Record<string, unknown>;
        if (metadata.perPaxAmount && typeof metadata.perPaxAmount === "string") {
          const amount = parseFloat(metadata.perPaxAmount).toFixed(2);
          setParticipantAmount(amount);
        }
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    }
  }, [record, setParticipantAmount]);

  const handleSubmit = async () => {
    // Reset any existing validation errors
    setValidationError(null);
    setIsLoading(true);
    try {
      await handleUpdateRecord();
    } catch (error) {
      console.error('Error updating record:', error);
      if (error instanceof Error) {
        setValidationError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-50 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
      <div className="text-center space-y-2 mb-4">
        <div className="text-2xl font-medium text-gray-800 dark:text-gray-200">
          <span className="mr-2">⚖️</span>
          Split Evenly
        </div>
      </div>

      <div className="space-y-4">
        {/* Updated UI - Card showing who should pay what */}
        <div className="border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6 bg-white dark:bg-gray-800">
          <div className="text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {newParticipantName || 'You'}, you should pay
            </p>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
              {formatCurrency(record.currency)}{participantAmount}
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        {record.profiles?.qr_url && (
          <div className="py-4">
            <div className="text-center space-y-2 mb-2">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Pay {record.profiles.name} with DuitNow QR</h3>
            </div>
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
                Download
              </a>
            </div>
          </div>
        )}

                {/* Mark as Paid toggle */}
        <div className="mt-4 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800"
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

          <Button
            disabled={validationError !== null}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

'use client';

import { useState, useEffect } from 'react';
import { Tables } from '@/lib/database.types';

interface SplitHostProps {
    selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
    handleUpdateRecord: () => Promise<void>;
    setParticipantAmount: (amount: string) => void;
    participantAmount: string;
    participants: Tables<'one_time_split_expenses_participants'>[];
    markAsPaid: boolean;
    setMarkAsPaid: (isPaid: boolean) => void;
    handleBack: () => void;
}

export default function SplitHost({
    selectedParticipant,
    setParticipantAmount,
    handleUpdateRecord,
    participantAmount,
    markAsPaid,
    setMarkAsPaid,
    handleBack,
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
            await handleUpdateRecord();
        } catch (error) {
            console.error('Error updating amount:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (<div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800 mt-6">
        <div className="text-center space-y-2 mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Host Split</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                Confirm your payment to the host
            </p>
        </div>

        <div className="space-y-4">
            {/* Display name - not editable in HOST mode */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-75 cursor-not-allowed"
                    value={selectedParticipant?.name || ''}
                    disabled
                />
            </div>

            {/* Display fixed amount - not editable */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Share Amount (Set by Host)
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                    <input
                        type="text"
                        className="w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-75 cursor-not-allowed"
                        value={selectedParticipant?.amount.toFixed(2) || '0.00'}
                        disabled
                    />
                </div>
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
    </div>)

}

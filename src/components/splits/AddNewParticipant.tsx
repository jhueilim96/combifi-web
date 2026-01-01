'use client';

import { Plus } from 'lucide-react';
import { Tables } from '@/lib/database.types';

interface AddNewParticipantProps {
  record: Tables<'one_time_split_expenses'>;
  participants: Tables<'one_time_split_expenses_participants'>[];
  numberOfPax: number;
  showNewNameInput: boolean;
  newParticipantName: string;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  onNewNameToggle: () => void;
  onNewParticipantNameChange: (name: string) => void;
}

export default function AddNewParticipant({
  record,
  participants,
  numberOfPax,
  showNewNameInput,
  newParticipantName,
  selectedParticipant,
  onNewNameToggle,
  onNewParticipantNameChange,
}: AddNewParticipantProps) {
  // Don't show if conditions are not met
  if (
    record.settle_mode === 'HOST' ||
    (record.settle_mode === 'PERPAX' && participants.length >= numberOfPax)
  ) {
    return null;
  }

  return (
    <>
      <div className="relative justify-items-center my-4 mb-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
      </div>
      <div
        className={`mt-4 transition-all duration-300 ${showNewNameInput || participants.length === 0 ? 'opacity-100' : 'opacity-80'}`}
      >
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center mb-3">
          Not on the list?
        </p>
        <div
          className={`border ${selectedParticipant ? 'border-gray-200 dark:border-gray-700' : 'border-indigo-300 dark:border-indigo-600'} rounded-xl p-4 bg-white dark:bg-gray-800 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-750`}
          onClick={onNewNameToggle}
        >
          {showNewNameInput || participants.length === 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                  Add your name
                </label>
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-lg py-3 px-4 border border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm transition-colors"
                value={newParticipantName}
                onChange={(e) => onNewParticipantNameChange(e.target.value)}
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Add your name
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

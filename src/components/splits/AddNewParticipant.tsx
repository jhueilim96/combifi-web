'use client';

import { UserPlus } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import { InstantSplitDetailedView } from '@/lib/viewTypes';

interface AddNewParticipantProps {
  record: InstantSplitDetailedView;
  participants: Tables<'one_time_split_expenses_participants'>[];
  numberOfPax: number;
  showNewNameInput: boolean;
  newParticipantName: string;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  onNewNameToggle: () => void;
  onNewParticipantNameChange: (name: string) => void;
  onAddClick: () => void;
}

export default function AddNewParticipant({
  record,
  participants,
  numberOfPax,
  newParticipantName,
  onNewParticipantNameChange,
  onAddClick,
}: AddNewParticipantProps) {
  // Don't show if conditions are not met
  if (
    record.settle_mode === 'HOST' ||
    (record.settle_mode === 'PERPAX' && participants.length >= numberOfPax)
  ) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
      <UserPlus
        size={20}
        className="text-gray-400 dark:text-gray-500 flex-shrink-0"
      />
      <input
        type="text"
        placeholder="Or type name to join..."
        className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none"
        value={newParticipantName}
        onChange={(e) => onNewParticipantNameChange(e.target.value)}
      />
      {newParticipantName.trim() && (
        <button
          onClick={onAddClick}
          className="text-sm font-medium text-gray-700 dark:text-gray-800 bg-white dark:bg-gray-200 px-4 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-300 transition-colors shadow-sm"
        >
          Join
        </button>
      )}
    </div>
  );
}

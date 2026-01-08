'use client';

import { CheckCircle, UserPlus } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import { SelectNameSectionProps } from './types';
import { formatCurrencyAmount } from '@/lib/currencyUtils';

// Expanded content - participant list + add new name
export function SelectNameExpanded({
  record,
  participants,
  selectedParticipant,
  newParticipantName,
  numberOfPax,
  onParticipantSelect,
  onNewParticipantNameChange,
  onProceed,
}: SelectNameSectionProps) {
  // Filter out host participants
  const nonHostParticipants = participants.filter((p) => p.is_host === false);

  // Check if we can add new participants
  const canAddNewParticipant =
    record.settle_mode !== 'HOST' &&
    !(record.settle_mode === 'PERPAX' && participants.length >= numberOfPax);

  const handleParticipantClick = (
    participant: Tables<'one_time_split_expenses_participants'>
  ) => {
    onParticipantSelect(participant);
    onProceed();
  };

  const handleNewNameSubmit = () => {
    if (newParticipantName.trim()) {
      onProceed();
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing participants */}
      {nonHostParticipants.map((participant, index) => (
        <div
          key={index}
          className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
            selectedParticipant?.id === participant.id
              ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => handleParticipantClick(participant)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-white font-medium">
                {participant.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {participant.is_paid ? '✓ Paid' : 'Not paid'}
                {' · '}
                {formatCurrencyAmount(participant.amount, record.currency)}
              </span>
            </div>
          </div>
          {selectedParticipant?.id === participant.id && (
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
          )}
        </div>
      ))}

      {/* Add new participant input */}
      {canAddNewParticipant && (
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNewNameSubmit();
              }
            }}
          />
          {newParticipantName.trim() && (
            <button
              onClick={handleNewNameSubmit}
              className="text-sm font-medium text-gray-700 dark:text-gray-800 bg-white dark:bg-gray-200 px-4 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-300 transition-colors shadow-sm"
            >
              Join
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Collapsed content - shows selected/joined name
export function SelectNameCollapsed({
  selectedParticipant,
  newParticipantName,
}: Pick<SelectNameSectionProps, 'selectedParticipant' | 'newParticipantName'>) {
  const displayName = selectedParticipant?.name || newParticipantName || 'None';
  const initial = displayName.charAt(0).toUpperCase();

  if (!selectedParticipant && !newParticipantName) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
            ?
          </span>
        </div>
        <span className="text-gray-400 dark:text-gray-500 text-sm">
          No name selected
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
          {initial}
        </span>
      </div>
      <span className="text-gray-900 dark:text-white font-medium">
        {displayName}
      </span>
    </div>
  );
}

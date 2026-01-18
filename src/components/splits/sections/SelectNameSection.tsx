'use client';

import { CheckCircle, UserPlus } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import { SelectNameSectionProps } from './types';
import { formatCurrencyAmount } from '@/lib/currencyUtils';
import RoundedHexagon from '@/components/common/RoundedHexagon';

// Expanded content - participant list + add new name
export function SelectNameExpanded({
  record,
  participants,
  selectedParticipant,
  newParticipantName,
  numberOfPax,
  onParticipantSelect,
  onNewParticipantNameChange,
  onClearParticipantSelection,
  onProceed,
}: SelectNameSectionProps) {
  // Filter out host participants
  const nonHostParticipants = participants.filter((p) => p.is_host === false);

  // Check if we can add new participants
  const canAddNewParticipant =
    record.settle_mode !== 'HOST' &&
    !(record.settle_mode === 'PERPAX' && participants.length >= numberOfPax);

  // Check for duplicate name (case-insensitive)
  const isDuplicateName =
    newParticipantName.trim() !== '' &&
    participants.some(
      (p) => p.name.toLowerCase() === newParticipantName.trim().toLowerCase()
    );

  const handleParticipantClick = (
    participant: Tables<'one_time_split_expenses_participants'>
  ) => {
    onParticipantSelect(participant);
    onProceed();
  };

  const handleNewNameSubmit = () => {
    if (newParticipantName.trim() && !isDuplicateName) {
      onProceed();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-2">
        {/* Existing participants */}
        {nonHostParticipants.map((participant, index) => {
          const isSelected = selectedParticipant?.id === participant.id;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-2 border-indigo-500 dark:border-indigo-400'
                  : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleParticipantClick(participant)}
            >
              <RoundedHexagon
                className="w-10 h-10 flex-shrink-0"
                bgClassName="text-gray-100 dark:text-gray-800"
              >
                <span className="text-base font-semibold text-gray-600 dark:text-gray-300">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </RoundedHexagon>
              <div className="flex flex-col min-w-32">
                <span className="text-gray-900 dark:text-white font-medium">
                  {participant.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {participant.is_paid ? '✓ Paid' : 'Not paid'}
                  {' · '}
                  {formatCurrencyAmount(participant.amount, record.currency)}
                </span>
              </div>
              {/* Always reserve space for checkmark */}
              <div className="w-5 h-5 flex-shrink-0">
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add new participant input */}
        {canAddNewParticipant && (
          <div className="mt-4 flex flex-col">
            <div
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                isDuplicateName
                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-400'
                  : newParticipantName.trim()
                    ? 'bg-gray-50 dark:bg-gray-800/50 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
              }`}
            >
              <UserPlus
                size={18}
                className={`flex-shrink-0 transition-colors ${
                  isDuplicateName
                    ? 'text-red-500 dark:text-red-400'
                    : newParticipantName.trim()
                      ? 'text-indigo-500 dark:text-indigo-400'
                      : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <input
                type="text"
                placeholder="Or type name to join..."
                className="bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none w-40"
                value={newParticipantName}
                onChange={(e) => {
                  onNewParticipantNameChange(e.target.value);
                  // Clear selected participant when typing a new name
                  if (e.target.value && selectedParticipant) {
                    onClearParticipantSelection();
                  }
                }}
                onFocus={() => {
                  // Clear selected participant when focusing on new name input
                  if (selectedParticipant) {
                    onClearParticipantSelection();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNewNameSubmit();
                  }
                }}
              />
              {newParticipantName.trim() && !isDuplicateName && (
                <button
                  onClick={handleNewNameSubmit}
                  className="text-sm font-medium text-gray-700 dark:text-gray-800 bg-white dark:bg-gray-200 px-4 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-300 transition-colors shadow-sm"
                >
                  Join
                </button>
              )}
            </div>
            {isDuplicateName && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-2">
                This name is already taken. Please enter a different name.
              </p>
            )}
          </div>
        )}
      </div>
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
      <div className="flex items-center justify-center gap-3">
        <RoundedHexagon
          className="w-8 h-8"
          bgClassName="text-gray-200 dark:text-gray-700"
        >
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
            ?
          </span>
        </RoundedHexagon>
        <span className="text-gray-400 dark:text-gray-500 text-sm">
          No name selected
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <RoundedHexagon
        className="w-10 h-10"
        bgClassName="text-gray-100 dark:text-gray-800"
      >
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          {initial}
        </span>
      </RoundedHexagon>
      <span className="text-gray-900 dark:text-white font-medium">
        {displayName}
      </span>
    </div>
  );
}

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  getRecord,
  getParticipantRecords,
  insertParticipantRecord,
  updateParticipantRecord,
  getPublicRecord,
} from './actions';
import { Tables } from '@/lib/database.types';
import SplitFriend from '@/components/splits/modes/SplitFriend';
import SplitPerPax from '@/components/splits/modes/SplitPerPax';
import SplitHost from '@/components/splits/modes/SplitHost';
import AddNewParticipant from '@/components/splits/AddNewParticipant';
import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { Button } from '@/components/ui/Button';
import { OTPInput } from '@/components/ui/OTPInput';
import SplitDetails from '@/components/splits/SplitDetails';
import AppPromoModal from '@/components/common/AppPromoModal';
import {
  formatLocalDateTime,
  PerPaxMetadata,
  retrieveSettleMetadata,
} from '@/lib/utils';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export const runtime = 'edge';

export default function RecordPage() {
  const params = useParams();
  const id = params?.id as string;

  const [record, setRecord] =
    useState<Tables<'one_time_split_expenses'> | null>(null);
  const [participants, setParticipants] = useState<
    Tables<'one_time_split_expenses_participants'>[]
  >([]);
  const [password, setPassword] = useState('');
  const [participantAmount, setParticipantAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Tables<'one_time_split_expenses_participants'> | null>(null);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [showNewNameInput, setShowNewNameInput] = useState(false);
  const [showSettleComponent, setShowSettleComponent] = useState(false);
  const [isUpdatingParticipant, setIsUpdatingParticipant] = useState(false);
  const [markAsPaid, setMarkAsPaid] = useState(false);

  const [publicInfo, setPublicInfo] = useState<Partial<
    Tables<'one_time_split_expenses'>
  > | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const numberOfPax =
    record?.settle_mode === 'PERPAX'
      ? retrieveSettleMetadata<PerPaxMetadata>(record).numberOfPax
      : 0;

  const fetchPublicRecord = useCallback(async () => {
    if (!id) return;

    try {
      const publicInfo = await getPublicRecord(id);
      setPublicInfo(publicInfo);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        setStatus(
          error instanceof Error ? error.message : 'Failed to update record.'
        );
      } else {
        setStatus('Oops. Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchRecord = async () => {
    if (!id || !password) return;

    setIsLoading(true);
    setStatus('Fetching ...');

    try {
      const data = await getRecord(id, password);
      const participantsData = await getParticipantRecords(id, password);
      setRecord(data);
      setParticipants(
        Array.isArray(participantsData) ? participantsData : [participantsData]
      );
      // Get amount from the first participant or default to 0
      setParticipantAmount('0.00');
      setShowPasswordModal(false);
      setStatus('');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        setStatus(
          error instanceof Error ? error.message : 'Failed to update record.'
        );
      } else {
        setStatus('Oops. Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRecord = async () => {
    if (!id || !password) return;

    setIsLoading(true);
    setStatus('Updating...');

    try {
      // If updating an existing participant
      if (isUpdatingParticipant && selectedParticipant?.id) {
        // Import the validation schemas
        const { updateParticipantSchema } = await import('@/lib/validations');

        const updateData = {
          amount: participantAmount,
          name: newParticipantName,
          markAsPaid: markAsPaid,
          currency: record!.currency,
        };

        // For PERPAX mode, don't allow amount changes
        const dataToValidate =
          record?.settle_mode === 'PERPAX'
            ? { ...updateData, amount: selectedParticipant.amount.toFixed(2) }
            : updateData;

        // Validate data before sending to server
        const validationResult =
          updateParticipantSchema.safeParse(dataToValidate);

        if (!validationResult.success) {
          console.error(
            '[DEBUG] handleUpdateRecord - Validation failed:',
            validationResult.error
          );
          const errorMessage = validationResult.error.errors
            .map((err) => err.message)
            .join(', ');
          throw new Error(errorMessage);
        }

        await updateParticipantRecord(
          id,
          password,
          selectedParticipant.id,
          validationResult.data
        );
      }
      // If adding a new participant (not available in HOST mode)
      else if (!isUpdatingParticipant && record?.settle_mode !== 'HOST') {
        // Import the validation schemas
        const { insertParticipantSchema } = await import('@/lib/validations');

        const insertData = {
          amount: participantAmount,
          name: newParticipantName,
          currency: record!.currency,
          markAsPaid: markAsPaid,
        };

        // Validate data before sending to server
        const validationResult = insertParticipantSchema.safeParse(insertData);

        if (!validationResult.success) {
          console.error(
            '[DEBUG] handleUpdateRecord - Validation failed:',
            validationResult.error
          );
          const errorMessage = validationResult.error.errors
            .map((err) => err.message)
            .join(', ');
          throw new Error(errorMessage);
        }

        await insertParticipantRecord(id, password, validationResult.data);
      }

      // Refresh participant data after update
      const participantsData = await getParticipantRecords(id, password);
      setParticipants(
        Array.isArray(participantsData) ? participantsData : [participantsData]
      );

      setStatus('Updated successfully!');
      setShowPromo(true); // Show promotional message after successful update
      setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    } catch (error) {
      console.error('[DEBUG] handleUpdateRecord - Error caught:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      if (process.env.NODE_ENV === 'development') {
        setStatus(
          error instanceof Error ? error.message : 'Failed to update record.'
        );
      } else {
        setStatus('Oops. Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoModalClose = () => {
    setShowPromo(false);
    resetUIState();
  };
  const handleParticipantSelect = (
    participant: Tables<'one_time_split_expenses_participants'>
  ) => {
    // console.log('Selected participant:', participant);
    setSelectedParticipant(participant);
    setParticipantAmount(participant.amount.toFixed(2));
    setNewParticipantName(participant.name);
    setMarkAsPaid(participant.is_paid);
    setShowNewNameInput(false);
    setIsUpdatingParticipant(true);
    setShowSettleComponent(true);
  };

  const handleNewNameToggle = () => {
    setShowNewNameInput(true);
    setSelectedParticipant(null);
    setNewParticipantName('');
    setMarkAsPaid(false);
    setIsUpdatingParticipant(false);
    setShowSettleComponent(false);
    // Reset showNewNameInput to false when clicking the plus button (like a reset)
    if (showNewNameInput) {
      setShowNewNameInput(false);
    }
  };

  const resetUIState = () => {
    setIsLoading(false);
    // Reset UI state after record update
    setSelectedParticipant(null);
    setNewParticipantName('');
    setMarkAsPaid(false);
    setIsUpdatingParticipant(false);
    setShowSettleComponent(false);
    setParticipantAmount('0.00');
    setShowNewNameInput(false);
    // Don't reset showPromo here - we want it to stay visible
  };

  useEffect(() => {
    if (id) {
      fetchPublicRecord();
    }
  }, [id, fetchPublicRecord]); // fetchPublicRecord is stable as it doesn't depend on external variables

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Compute display values
  const hostParticipant = record?.profiles;

  if (showPasswordModal && publicInfo) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 px-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 dark:border-gray-700 animate-scaleIn">
          <div className="flex items-center mb-8 gap-4">
            {/* Circular avatar */}
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-xl font-bold flex-shrink-0 shadow-sm">
              {publicInfo.profiles?.name
                ? publicInfo.profiles.name.charAt(0).toUpperCase()
                : '?'}
            </div>

            {/* Invitation text */}
            <div className="flex-1">
              <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-relaxed">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {publicInfo.profiles?.name}
                </span>{' '}
                has invited you to split
                <span className="block mt-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  {publicInfo.description}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formatLocalDateTime(publicInfo.date)}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-4 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Enter code to join
              </p>
              <div className="space-y-4">
                <OTPInput
                  value={password}
                  onChange={(value) => setPassword(value)}
                  length={4}
                />
                <Button
                  onClick={fetchRecord}
                  isLoading={isLoading}
                  loadingText="Loading..."
                  text="Join Split"
                  className="w-full"
                />
              </div>
            </div>

            {status && (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                <AlertTriangle size={18} className="flex-shrink-0" />
                <span className="text-sm">{status}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 ">
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-br from-indigo-500 via-indigo-400 to-purple-500 dark:from-indigo-700 dark:via-indigo-600 dark:to-purple-800"
          style={{
            height: 'calc(180px + 8vh)',
            clipPath: 'ellipse(150% 100% at 50% 0%)',
          }}
        />
      </div>
      {/* Content container with spacing matching Vue page */}
      <div className="max-w-xl mx-auto px-4 py-8 absolute top-0 w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">Split and Pay</h1>
          <p className="text-white text-base mb-2">
            <b>{hostParticipant?.name || 'Someone'}</b> has invited you to
            settle a <br /> shared expense
          </p>
        </div>

        {/* Main content when record is available with improved card styling */}
        {record && !showPasswordModal && (
          <div className="bg-white rounded-2xl">
            <SplitDetails record={record} />
            {/* Improved Participants section */}
            {!showSettleComponent && (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-6">
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Who are you?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Select your name below to continue
                  </p>
                </div>

                {participants.length > 1 ? (
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {participants
                      .filter((p) => p.is_host === false)
                      .map((participant, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedParticipant?.id === participant.id
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500 dark:border-indigo-400 shadow-sm'
                              : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => handleParticipantSelect(participant)}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                                selectedParticipant?.id === participant.id
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <span className="text-sm font-semibold">
                                {participant.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-800 dark:text-gray-200 font-medium">
                                {participant.name}
                              </span>
                              <span
                                className={`text-xs font-medium ${participant.is_paid ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}
                              >
                                {participant.is_paid ? '✓ Paid' : '○ Pending'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {formatCurrencyAmount(
                                participant.amount,
                                record.currency
                              )}
                            </span>
                            {selectedParticipant?.id === participant.id && (
                              <CheckCircle
                                size={20}
                                className="text-indigo-500 dark:text-indigo-400"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      👻 You are early, no one has joined yet
                    </div>
                  </div>
                )}

                <AddNewParticipant
                  record={record}
                  participants={participants}
                  numberOfPax={numberOfPax}
                  showNewNameInput={showNewNameInput}
                  newParticipantName={newParticipantName}
                  selectedParticipant={selectedParticipant}
                  onNewNameToggle={handleNewNameToggle}
                  onNewParticipantNameChange={setNewParticipantName}
                />
              </div>
            )}

            {showSettleComponent && record ? (
              <>
                {record.settle_mode === 'FRIEND' && (
                  <SplitFriend
                    record={record}
                    selectedParticipant={selectedParticipant}
                    newParticipantName={newParticipantName}
                    setNewParticipantName={setNewParticipantName}
                    handleUpdateRecord={handleUpdateRecord}
                    setParticipantAmount={setParticipantAmount}
                    participantAmount={participantAmount}
                    participants={participants}
                    markAsPaid={markAsPaid}
                    setMarkAsPaid={setMarkAsPaid}
                    handleBack={resetUIState}
                  />
                )}

                {record.settle_mode === 'PERPAX' && (
                  <SplitPerPax
                    record={record}
                    selectedParticipant={selectedParticipant}
                    newParticipantName={newParticipantName}
                    handleUpdateRecord={handleUpdateRecord}
                    setParticipantAmount={setParticipantAmount}
                    participantAmount={participantAmount}
                    markAsPaid={markAsPaid}
                    setMarkAsPaid={setMarkAsPaid}
                    handleBack={resetUIState}
                  />
                )}

                {record.settle_mode === 'HOST' && (
                  <SplitHost
                    record={record}
                    selectedParticipant={selectedParticipant}
                    handleUpdateRecord={handleUpdateRecord}
                    setParticipantAmount={setParticipantAmount}
                    participantAmount={participantAmount}
                    markAsPaid={markAsPaid}
                    setMarkAsPaid={setMarkAsPaid}
                    participants={participants}
                    handleBack={resetUIState}
                  />
                )}
              </>
            ) : (
              <button
                className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg text-base mt-6"
                onClick={() => {
                  if (
                    selectedParticipant ||
                    (newParticipantName.trim() &&
                      record?.settle_mode !== 'HOST')
                  ) {
                    setShowSettleComponent(true);
                  } else {
                    handleUpdateRecord();
                  }
                }}
                disabled={
                  !selectedParticipant &&
                  (record?.settle_mode === 'HOST' || !newParticipantName.trim())
                }
              >
                {selectedParticipant
                  ? `Join as ${selectedParticipant.name}`
                  : newParticipantName.trim()
                    ? `Join as ${newParticipantName}`
                    : 'Join Split'}
              </button>
            )}
          </div>
        )}

        {/* Promotional Message */}
        {showPromo && (
          <AppPromoModal handleModalClose={handlePromoModalClose} />
        )}

        {/* Status message with improved styling */}
        {status && !showPasswordModal && (
          <div className="mt-4 text-center animate-fadeIn">
            <p
              className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                status.includes('success')
                  ? 'bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              }`}
            >
              {status.includes('success') ? (
                <CheckCircle size={20} className="mr-2" />
              ) : (
                <AlertCircle size={20} className="mr-2" />
              )}
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

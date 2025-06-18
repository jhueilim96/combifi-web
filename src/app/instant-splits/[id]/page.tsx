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
  }, [id]); // fetchPublicRecord is stable as it doesn't depend on external variables

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Compute display values
  const hostParticipant = record?.profiles;

  if (showPasswordModal && publicInfo) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-100 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-xl w-full transform transition-all duration-300 animate-scaleIn">
          <div className="flex items-center mb-10">
            {/* Circular avatar */}
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-xl font-semibold mr-4 flex-shrink-0">
              {publicInfo.profiles?.name
                ? publicInfo.profiles.name.charAt(0).toUpperCase()
                : '?'}
            </div>

            {/* Invitation text */}
            <div>
              <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {publicInfo.profiles?.name}
                </span>{' '}
                has invited you to split
                <span className="ml-1 font-bold text-indigo-600 dark:text-indigo-400">
                  {publicInfo.description}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatLocalDateTime(publicInfo.date)}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-gray-700 dark:text-gray-300 font-normal mb-5">
              Enter code to join:
            </p>
            <div className="flex flex-col space-y-5">
              <OTPInput
                value={password}
                onChange={(value) => setPassword(value)}
                length={4}
                className="mb-5"
              />
              <Button
                onClick={fetchRecord}
                isLoading={isLoading}
                loadingText="Loading..."
                text="Join"
                className="w-1/2 mx-auto"
              />
            </div>
          </div>

          {status && (
            <div className="w-full">
              <p className="px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center flex items-center justify-center">
                <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                {status}
              </p>
            </div>
          )}
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
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
                <div className="text-center space-y-2 mb-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Who are you?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Select your name below to continue.
                  </p>
                </div>

                {participants.length > 1 ? (
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    {participants
                      .filter((p) => p.is_host === false)
                      .map((participant, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedParticipant?.id === participant.id
                              ? 'bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500 dark:border-indigo-400'
                              : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-700'
                          }`}
                          onClick={() => handleParticipantSelect(participant)}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedParticipant?.id === participant.id
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <span className="text-sm font-medium">
                                {participant.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-800 dark:text-gray-200 font-medium">
                                {participant.name}
                              </span>
                              <span
                                className={`text-xs ${participant.is_paid ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
                              >
                                {participant.is_paid ? '✓ Paid' : '○ Not Paid'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                              {formatCurrencyAmount(
                                participant.amount,
                                record.currency
                              )}
                            </span>
                            {selectedParticipant?.id === participant.id && (
                              <CheckCircle
                                size={20}
                                className="ml-2 text-indigo-500"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-center opacity-80">
                    <div className="text-sm text-gray-400 dark:text-gray-300">
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
              <>
                <button
                  className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg mt-6"
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
                    (record?.settle_mode === 'HOST' ||
                      !newParticipantName.trim())
                  }
                >
                  {selectedParticipant
                    ? `Join as ${selectedParticipant.name}`
                    : newParticipantName.trim()
                      ? `Join as ${newParticipantName}`
                      : 'Join Expense'}
                </button>
              </>
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
      {/* Add custom loader styling */}
      <style jsx>{`
        .running-loader {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto;
          text-align: center;
        }

        .runner {
          width: 20px;
          height: 20px;
          background-color: #4f46e5;
          border-radius: 50%;
          position: absolute;
          top: 30px;
          left: 0;
          animation:
            run 0.5s linear infinite,
            bounce 0.5s ease-in-out infinite;
        }

        .ground {
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: #dcdcdc;
          overflow: hidden;
        }

        .ground::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 4px;
          background: repeating-linear-gradient(
            90deg,
            #ccc,
            #ccc 10px,
            #eee 10px,
            #eee 20px
          );
          animation: moveGround 1s linear infinite;
        }

        .loading-text {
          bottom: 0;
          left: 0;
          width: 100%;
          font-size: 14px;
          color: #4a4a4a;
          font-weight: 600;
          margin-top: 3rem;
        }

        @keyframes run {
          0% {
            left: 0;
          }
          100% {
            left: calc(100% - 20px);
          }
        @keyframes run {
          0% {
            left: 0;ounce {
          }%,
          100% {
            left: calc(100% - 20px);
          }
        } 50% {
            top: 10px;
        @keyframes bounce {
          0%,
          100% {
            top: 30px;eGround {
          }% {
          50% {nsform: translateX(0);
            top: 10px;
          }00% {
        }   transform: translateX(-20px);
          }
        @keyframes moveGround {
          0% {
            transform: translateX(0);
          }rom {
          100% {ity: 0;
            transform: translateX(-20px);
          }o {
        }   opacity: 1;
          }
        @keyframes fadeIn {
          from {
            opacity: 0;eIn {
          }rom {
          to {ansform: scale(0.95);
            opacity: 1;
          }
        } to {
            transform: scale(1);
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }yframes fadeInUp {
          to { {
            transform: scale(1);
            opacity: 1;translateY(10px);
          }
        } to {
            opacity: 1;
        @keyframes fadeInUp {ateY(0);
          from {
            opacity: 0;
            transform: translateY(10px);
          }imate-fadeIn {
          to {ation: fadeIn 0.3s ease-out forwards;
            opacity: 1;
            transform: translateY(0);
          }imate-scaleIn {
        } animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        } animation: fadeInUp 0.4s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
}
        .animate-fadeInUp {          animation: fadeInUp 0.4s ease-out forwards;        }      `}</style>{' '}
    </div>
  );
}

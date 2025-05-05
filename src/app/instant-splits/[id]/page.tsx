'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRecord, getParticipantRecords, insertParticipantRecord, updateParticipantRecord, getPublicRecord } from './actions';
import { Tables } from '@/lib/database.types';
import SplitFriend from '@/components/settleComponents/SplitFriend';
import SplitPerPax from '@/components/settleComponents/SplitPerPax';
import SplitHost from '@/components/settleComponents/SplitHost';
import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { Button } from '@/components/ui/Button';
import { OTPInput } from '@/components/ui/OTPInput';

export const runtime = 'edge';

export default function RecordPage() {
  const params = useParams();
  const id = params?.id as string;

  const [record, setRecord] = useState<Tables<'one_time_split_expenses'> | null>(null);
  const [participants, setParticipants] = useState<Tables<'one_time_split_expenses_participants'>[]>([]);
  const [password, setPassword] = useState('');
  const [participantAmount, setParticipantAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<Tables<'one_time_split_expenses_participants'> | null>(null);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [showNewNameInput, setShowNewNameInput] = useState(false);
  const [showSettleComponent, setShowSettleComponent] = useState(false);
  const [isUpdatingParticipant, setIsUpdatingParticipant] = useState(false);
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [publicInfo, setPublicInfo] = useState<Partial<Tables<'one_time_split_expenses'>> | null>(null);

  const fetchPublicRecord = async () => {
    if (!id) return;

    try {
      const publicInfo = await getPublicRecord(id);
      setPublicInfo(publicInfo);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        setStatus(error instanceof Error ? error.message : 'Failed to update record.');
      } else {
        setStatus('Oops. Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecord = async () => {
    if (!id || !password) return;

    setIsLoading(true);
    setStatus('Fetching ...');

    try {
      const data = await getRecord(id, password);
      const participantsData = await getParticipantRecords(id, password);
      setRecord(data);
      setParticipants(Array.isArray(participantsData) ? participantsData : [participantsData]);
      // Get amount from the first participant or default to 0
      setParticipantAmount('0.00');
      setShowPasswordModal(false);
      setStatus('');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        setStatus(error instanceof Error ? error.message : 'Failed to update record.');
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
        const dataToValidate = record?.settle_mode === 'PERPAX'
          ? { ...updateData, amount: selectedParticipant.amount.toFixed(2) }
          : updateData;

        // Validate data before sending to server
        const validationResult = updateParticipantSchema.safeParse(dataToValidate);

        if (!validationResult.success) {
          const errorMessage = validationResult.error.errors.map(err => err.message).join(', ');
          throw new Error(errorMessage);
        }

        await updateParticipantRecord(id, password, selectedParticipant.id, validationResult.data);
      }
      // If adding a new participant (not available in HOST mode)
      else if (!isUpdatingParticipant && record?.settle_mode !== 'HOST') {
        // Import the validation schemas
        const { insertParticipantSchema } = await import('@/lib/validations');

        const insertData = {
          amount: participantAmount,
          name: newParticipantName,
          currency: record!.currency,
        };

        // Validate data before sending to server
        const validationResult = insertParticipantSchema.safeParse(insertData);

        if (!validationResult.success) {
          const errorMessage = validationResult.error.errors.map(err => err.message).join(', ');
          throw new Error(errorMessage);
        }

        await insertParticipantRecord(id, password, validationResult.data);
      }

      // Refresh participant data after update
      const participantsData = await getParticipantRecords(id, password);
      setParticipants(Array.isArray(participantsData) ? participantsData : [participantsData]);

      setStatus('Updated successfully!');
      setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        setStatus(error instanceof Error ? error.message : 'Failed to update record.');
      } else {
        setStatus('Oops. Something went wrong.');
      }
    } finally {
      resetUIState();
    }
  };

  const handleParticipantSelect = (participant: Tables<'one_time_split_expenses_participants'>) => {
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
  }

  const toggleEnlargedImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEnlargedImage(!showEnlargedImage);
  };


  useEffect(() => {
    if (id) {
      fetchPublicRecord();
    }
  }, [id]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="running-loader">
          <div className="runner" />
          <div className="ground" />
          <p className="loading-text">
            Loading...
          </p>
        </div>
      </div>
    );
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
              {publicInfo.profiles?.name ? publicInfo.profiles.name.charAt(0).toUpperCase() : '?'}
            </div>

            {/* Invitation text */}
            <div>
              <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
                <span className="text-indigo-600 dark:text-indigo-400">{publicInfo.profiles?.name}</span> has invited you to split
                <span className="ml-1 font-bold text-indigo-600 dark:text-indigo-400">{publicInfo.description}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {publicInfo.date ? new Date(publicInfo.date as string).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-gray-700 dark:text-gray-300 font-normal mb-5">Enter code to join:</p>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {status}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 ">
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-br from-indigo-500 via-indigo-400 to-purple-500 dark:from-indigo-700 dark:via-indigo-600 dark:to-purple-800"
          style={{
            height: 'calc(180px + 8vh)',
            clipPath: 'ellipse(150% 100% at 50% 0%)'
          }}
        />
      </div>

      {/* Content container with spacing matching Vue page */}
      <div className="max-w-xl mx-auto px-4 py-8 absolute top-0 w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Split and Pay
          </h1>
          <p className="text-white text-base mb-2">
            <b>{hostParticipant?.name || 'Someone'}</b> has invited you to settle a <br /> shared expense
          </p>
        </div>

        {/* Main content when record is available with improved card styling */}
        {record && !showPasswordModal && (
          <div className="bg-white rounded-2xl">
            {/* Record card with enhanced shadows and gradients */}
            <div className="border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col space-y-4 mb-6">
              <div className="flex justify-between items-center space-x-6">
                <div className="text-left overflow-hidden">
                  <h2
                    className="text-sm text-gray-700 dark:text-gray-300 font-normal cursor-pointer"
                  >
                    {record.description || 'Untitled Split'}
                  </h2>

                  <div className="flex items-baseline cursor-pointer">
                    <span className="text-[2.5rem] font-semibold text-gray-800 dark:text-gray-200 tracking-tight truncate overflow-hidden">
                      {formatCurrencyAmount(record.amount, record.currency)}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {record.date ? new Date(record.date as string).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>
                <div className={`${showEnlargedImage
                  ? 'w-full h-auto min-h-[300px] transition-all duration-300 absolute top-0 right-0 z-10 bg-white dark:bg-gray-800 p-4 shadow-xl rounded-xl'
                  : 'w-24 h-24'} overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col justify-center items-center relative`}>
                  {record.file_url ? (
                    <>
                      <img
                        src={record.file_url}
                        alt="Receipt Photo"
                        width={200}
                        height={200}
                        className={`${showEnlargedImage ? 'object-contain max-h-[400px]' : 'object-cover'} w-full h-full cursor-pointer transition-all duration-300`}
                        onClick={toggleEnlargedImage}
                      />
                      {showEnlargedImage && (
                        <button
                          className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={toggleEnlargedImage}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <p className="text-gray-400 dark:text-gray-500 text-[0.75rem] font-extralight">
                        No Image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes section - integrated into main content */}
              {record.notes && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
                        {record.notes}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Improved Participants section */}
            {!showSettleComponent && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
                <div className="text-center space-y-2 mb-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Who are you?</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Select your name below to continue.
                  </p>
                </div>

                {participants.length > 1 ? (
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    {participants.filter((p) => p.is_host === false).map((participant, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedParticipant?.id === participant.id
                          ? 'bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-500 dark:border-indigo-400'
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-700'
                          }`}
                        onClick={() => handleParticipantSelect(participant)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedParticipant?.id === participant.id
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                            <span className="text-sm font-medium">{participant.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-800 dark:text-gray-200 font-medium">{participant.name}</span>
                            <span className={`text-xs ${participant.is_paid ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                              {participant.is_paid ? '✓ Paid' : '○ Not Paid'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            {formatCurrencyAmount(participant.amount, record.currency)}
                          </span>
                          {selectedParticipant?.id === participant.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-3 text-center opacity-80">
                    <div className="text-sm text-gray-400 dark:text-gray-300">👻 You are early, no one has joined yet</div>
                  </div>
                )}

                {record.settle_mode !== 'HOST' && (
                  <>
                    <div className="relative justify-items-center my-4 mb-10">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                    </div>
                    <div className={`mt-4 transition-all duration-300 ${showNewNameInput || participants.length === 0 ? 'opacity-100' : 'opacity-80'}`}>
                      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-3">
                        Not on the list?
                      </p>
                      <div
                        className={`border ${selectedParticipant ? 'border-gray-200 dark:border-gray-700' : 'border-indigo-300 dark:border-indigo-600'} rounded-xl p-4 bg-white dark:bg-gray-700 cursor-pointer`}
                        onClick={handleNewNameToggle}
                      >
                        {showNewNameInput || participants.length === 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                              <label className="block text-gray-700 dark:text-gray-300 font-medium">Add your name</label>
                            </div>
                            <input
                              type="text"
                              placeholder="Enter your name"
                              className="w-full rounded-lg py-2 px-3 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                              value={newParticipantName}
                              onChange={(e) => setNewParticipantName(e.target.value)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Add your name</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>)}

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
                    if (selectedParticipant || (newParticipantName.trim() && record?.settle_mode !== 'HOST')) {
                      setShowSettleComponent(true);
                    } else {
                      handleUpdateRecord();
                    }
                  }}
                  disabled={
                    (!selectedParticipant &&
                      (record?.settle_mode === 'HOST' || !newParticipantName.trim()))
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

        {/* Status message with improved styling */}
        {status && !showPasswordModal && (
          <div className="mt-4 text-center animate-fadeIn">
            <p className={`px-4 py-3 rounded-lg flex items-center justify-center ${status.includes('success')
              ? 'bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
              {status.includes('success') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
          background-color: #4F46E5;
          border-radius: 50%;
          position: absolute;
          top: 30px;
          left: 0;
          animation: run 0.5s linear infinite, bounce 0.5s ease-in-out infinite;
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
        }

        @keyframes bounce {
          0%, 100% {
            top: 30px;
          }
          50% {
            top: 10px;
          }
        }

        @keyframes moveGround {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

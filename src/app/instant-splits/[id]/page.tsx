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
import { SelectedPaymentMethod } from '@/components/splits/payment/TabbedPaymentMethods';
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
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const runtime = 'edge';

// Development bypass - set to a password to skip the modal during dev
// e.g., 'TEST' to bypass, or '' to disable
const DEV_BYPASS_PASSWORD =
  process.env.NODE_ENV === 'development' ? 'MUDS' : '';

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
  const [isJoiningRecord, setIsJoiningRecord] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Tables<'one_time_split_expenses_participants'> | null>(null);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [showNewNameInput, setShowNewNameInput] = useState(false);
  const [showSettleComponent, setShowSettleComponent] = useState(false);
  const [isUpdatingParticipant, setIsUpdatingParticipant] = useState(false);
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<SelectedPaymentMethod | null>(null);

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

  const fetchRecord = async (passwordOverride?: string) => {
    const pwd = passwordOverride || password;
    if (!id || !pwd) return;

    setIsJoiningRecord(true);
    setStatus('');

    try {
      const data = await getRecord(id, pwd);
      const participantsData = await getParticipantRecords(id, pwd);
      setRecord(data);
      setParticipants(
        Array.isArray(participantsData) ? participantsData : [participantsData]
      );
      // Get amount from the first participant or default to 0
      setParticipantAmount('0.00');
      // Explicitly save password to state after successful auth
      setPassword(pwd);
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
      setIsJoiningRecord(false);
    }
  };

  const handleUpdateRecord = async () => {
    console.log('[DEBUG] handleUpdateRecord called with:', {
      id,
      password,
      isUpdatingParticipant,
      selectedParticipant: selectedParticipant?.id,
      settleMode: record?.settle_mode,
    });
    if (!id || !password) {
      console.log('[DEBUG] Early return - missing id or password');
      return;
    }

    setIsLoading(true);
    setStatus('Updating...');

    try {
      // If updating an existing participant
      if (isUpdatingParticipant && selectedParticipant?.id) {
        console.log('[DEBUG] Entering UPDATE branch');
        // Import the validation schemas
        const { updateParticipantSchema } = await import('@/lib/validations');

        // Build payment method metadata - always store selected method, paidAt only when paid
        const paymentMethodMetadata = selectedPaymentMethod
          ? {
              label: selectedPaymentMethod.label,
              type: selectedPaymentMethod.type,
              paidAt: markAsPaid ? new Date().toISOString() : null,
            }
          : null;

        const updateData = {
          amount: participantAmount,
          name: newParticipantName,
          markAsPaid: markAsPaid,
          currency: record!.currency,
          paymentMethodMetadata,
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
        console.log('[DEBUG] Entering INSERT branch');
        // Import the validation schemas
        const { insertParticipantSchema } = await import('@/lib/validations');

        // Build payment method metadata - always store selected method, paidAt only when paid
        const paymentMethodMetadata = selectedPaymentMethod
          ? {
              label: selectedPaymentMethod.label,
              type: selectedPaymentMethod.type,
              paidAt: markAsPaid ? new Date().toISOString() : null,
            }
          : null;

        const insertData = {
          amount: participantAmount,
          name: newParticipantName,
          currency: record!.currency,
          markAsPaid: markAsPaid,
          paymentMethodMetadata,
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
      } else {
        console.log('[DEBUG] Neither UPDATE nor INSERT branch entered!');
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
    setSelectedPaymentMethod(null);
    // Don't reset showPromo here - we want it to stay visible
  };

  useEffect(() => {
    if (id) {
      fetchPublicRecord();
    }
  }, [id, fetchPublicRecord]); // fetchPublicRecord is stable as it doesn't depend on external variables

  // Development bypass - auto-submit password
  useEffect(() => {
    if (
      DEV_BYPASS_PASSWORD &&
      publicInfo &&
      showPasswordModal &&
      !isJoiningRecord
    ) {
      fetchRecord(DEV_BYPASS_PASSWORD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicInfo, showPasswordModal]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showPasswordModal && publicInfo) {
    return (
      <div className="fixed inset-0 bg-gray-100 dark:bg-gray-950 flex items-start justify-center z-50 px-4 pt-12 sm:pt-20 animate-fadeIn overflow-y-auto">
        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800 animate-scaleIn mb-8">
          {/* Invitation header - compact */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-bold flex-shrink-0">
              {publicInfo.profiles?.name
                ? publicInfo.profiles.name.charAt(0).toUpperCase()
                : '?'}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {publicInfo.profiles?.name}
              </span>{' '}
              invited you to join
            </p>
          </div>

          {/* Split details - compact white card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
              {publicInfo.description}
            </p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {formatCurrencyAmount(
                publicInfo.amount || 0,
                publicInfo.currency || 'USD'
              )}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {formatLocalDateTime(publicInfo.date)}
            </p>
          </div>

          {/* Join form - emphasized with more spacing */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Enter code to join
              </p>
              {password && (
                <button
                  type="button"
                  onClick={() => setPassword('')}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="mb-12">
              <OTPInput
                value={password}
                onChange={(value) => setPassword(value)}
                onComplete={(value) => fetchRecord(value)}
                length={4}
              />
            </div>
            <Button
              onClick={() => fetchRecord()}
              isLoading={isJoiningRecord}
              loadingText="Joining..."
              text="Join Split"
              className="w-full"
            />

            {status && (
              <div className="mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-start justify-center px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <div className="max-w-xl mx-auto px-4 py-8 relative w-full z-10">
        {/* Main content when record is available */}
        {record && !showPasswordModal && (
          <div className="rounded-2xl">
            <SplitDetails record={record} />
            {/* Participants section */}
            {!showSettleComponent && (
              <>
                {/* SELECT NAME divider */}
                <div className="flex items-center gap-4 mt-8 mb-6">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
                    Select Name
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="space-y-2">
                  {participants
                    .filter((p) => p.is_host === false)
                    .map((participant, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                          selectedParticipant?.id === participant.id
                            ? 'border-2 border-indigo-500 dark:border-indigo-400'
                            : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => handleParticipantSelect(participant)}
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
                              {formatCurrencyAmount(
                                participant.amount,
                                record.currency
                              )}
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
              </>
            )}

            {showSettleComponent && record ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mt-8 mb-4">
                  Complete payment
                </h3>

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
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
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
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
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
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                )}
              </>
            ) : (
              <button
                className="w-full py-4 px-6 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-semibold text-lg mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Continue</span>
                <ArrowRight size={20} />
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

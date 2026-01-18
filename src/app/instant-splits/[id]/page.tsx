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
import { InstantSplitDetailedView } from '@/lib/viewTypes';
import { SelectedPaymentMethod } from '@/components/splits/payment/TabbedPaymentMethods';
import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { Button } from '@/components/ui/Button';
import { OTPInput } from '@/components/ui/OTPInput';
import {
  formatLocalDateTime,
  PerPaxMetadata,
  retrieveSettleMetadata,
} from '@/lib/utils';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { useSectionState } from '@/lib/useSectionState';
import {
  CollapsibleSection,
  SplitDetailExpanded,
  SplitDetailCollapsed,
  SelectNameExpanded,
  SelectNameCollapsed,
  AmountExpanded,
  AmountCollapsed,
  PaymentExpanded,
  PaymentCollapsed,
  FixedFooter,
  SECTION_METADATA,
  SECTION_DELAYS,
} from '@/components/splits/sections';

export const runtime = 'edge';

// Development bypass - set to a password to skip the modal during dev
// e.g., 'TEST' to bypass, or '' to disable
const DEV_BYPASS_PASSWORD = process.env.NODE_ENV === 'development' ? '' : '';

export default function RecordPage() {
  const params = useParams();
  const id = params?.id as string;

  // Core data state
  const [record, setRecord] = useState<InstantSplitDetailedView | null>(null);
  const [participants, setParticipants] = useState<
    Tables<'one_time_split_expenses_participants'>[]
  >([]);
  const [publicInfo, setPublicInfo] = useState<Partial<
    Tables<'one_time_split_expenses'>
  > | null>(null);

  // Auth state
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [isJoiningRecord, setIsJoiningRecord] = useState(false);

  // UI state
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [selectedParticipant, setSelectedParticipant] =
    useState<Tables<'one_time_split_expenses_participants'> | null>(null);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [participantAmount, setParticipantAmount] = useState('');
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<SelectedPaymentMethod | null>(null);
  const [isUpdatingParticipant, setIsUpdatingParticipant] = useState(false);

  // Section state management
  const {
    expandedSections,
    sectionStatuses,
    toggleSection,
    advanceFromName,
    advanceFromAmount,
    goToStep,
  } = useSectionState();

  // Derived values
  const numberOfPax =
    record?.settle_mode === 'PERPAX'
      ? retrieveSettleMetadata<PerPaxMetadata>(record).numberOfPax
      : 0;

  // Check for duplicate name (case-insensitive)
  const isDuplicateName =
    newParticipantName.trim() !== '' &&
    participants.some(
      (p) => p.name.toLowerCase() === newParticipantName.trim().toLowerCase()
    );

  const hasSelectedName = !!(
    selectedParticipant ||
    (newParticipantName.trim() && !isDuplicateName)
  );
  const hasAmount = !!(participantAmount && parseFloat(participantAmount) > 0);
  const isFooterVisible =
    hasSelectedName &&
    hasAmount &&
    sectionStatuses.payment !== 'upcoming' &&
    selectedPaymentMethod !== null;

  // Error states for sections (shown when collapsed)
  const nameHasError = !hasSelectedName && sectionStatuses.name === 'completed';
  const amountHasError = !hasAmount && sectionStatuses.amount === 'completed';

  // Locked state - prevent section toggling after successful save
  const isLocked = successMessage !== null;
  const handleToggleSection = (
    sectionId: 'details' | 'name' | 'amount' | 'payment'
  ) => {
    if (isLocked) return; // Prevent toggling when locked
    toggleSection(sectionId);
  };

  // Fetch public record info
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

  // Fetch full record with password
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
      setParticipantAmount(''); // Empty to show placeholder
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

  // Handle participant/record update
  const handleUpdateRecord = async () => {
    if (!id || !password || !record) {
      return;
    }

    setIsSubmitting(true);
    try {
      // If updating an existing participant
      if (isUpdatingParticipant && selectedParticipant?.id) {
        const { updateParticipantSchema } = await import('@/lib/validations');

        const paymentMethodMetadata = selectedPaymentMethod
          ? {
              label: selectedPaymentMethod.label,
              type: selectedPaymentMethod.type,
              paidAt: markAsPaid ? new Date().toISOString() : null,
            }
          : null;

        const updateData = {
          amount: participantAmount,
          name: newParticipantName || selectedParticipant.name,
          markAsPaid: markAsPaid,
          currency: record.currency,
          paymentMethodMetadata,
        };

        const dataToValidate =
          record.settle_mode === 'PERPAX'
            ? { ...updateData, amount: selectedParticipant.amount.toFixed(2) }
            : updateData;

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
      else if (!isUpdatingParticipant && record.settle_mode !== 'HOST') {
        const { insertParticipantSchema } = await import('@/lib/validations');

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
          currency: record.currency,
          markAsPaid: markAsPaid,
          paymentMethodMetadata,
        };

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
      const participantsList = Array.isArray(participantsData)
        ? participantsData
        : [participantsData];
      setParticipants(participantsList);

      // For new participants: find and select the newly created one
      if (!isUpdatingParticipant) {
        const newParticipant = participantsList.find(
          (p) =>
            p.name.toLowerCase() === newParticipantName.trim().toLowerCase()
        );
        if (newParticipant) {
          setSelectedParticipant(newParticipant);
        }
      }

      // Clear the input field
      setNewParticipantName('');

      // Collapse all sections to show summary
      goToStep('complete');

      // Show success message based on paid status
      const amount = formatCurrencyAmount(
        parseFloat(participantAmount),
        record.currency
      );
      if (markAsPaid) {
        setSuccessMessage(`Paid ${record.name} ${amount}`);
      } else {
        setSuccessMessage(`Pending payment ${amount} to ${record.name}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        setStatus(
          error instanceof Error ? error.message : 'Failed to update record.'
        );
      } else {
        setStatus('Oops. Something went wrong.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle participant selection from list
  const handleParticipantSelect = (
    participant: Tables<'one_time_split_expenses_participants'>
  ) => {
    setSelectedParticipant(participant);
    setParticipantAmount(participant.amount.toFixed(2));
    setNewParticipantName(''); // Clear new name input when selecting existing participant
    setMarkAsPaid(participant.is_paid);
    setIsUpdatingParticipant(true);

    // Restore saved payment method if exists
    const savedPaymentMethod = participant.payment_method_metadata as {
      label?: string;
      type?: 'IMAGE' | 'TEXT';
    } | null;
    if (savedPaymentMethod?.label && savedPaymentMethod?.type) {
      setSelectedPaymentMethod({
        label: savedPaymentMethod.label,
        type: savedPaymentMethod.type,
      });
    } else {
      setSelectedPaymentMethod(null);
    }
  };

  // Handle proceeding from name section
  const handleNameProceed = () => {
    advanceFromName();
  };

  // Handle proceeding from amount section
  const handleAmountProceed = () => {
    advanceFromAmount();
  };

  // Reset UI state
  const resetUIState = () => {
    setSelectedParticipant(null);
    setNewParticipantName('');
    setMarkAsPaid(false);
    setIsUpdatingParticipant(false);
    setParticipantAmount(''); // Empty to show placeholder
    setSelectedPaymentMethod(null);
    setSuccessMessage(null);
    goToStep('initial');
  };

  // Effects
  useEffect(() => {
    if (id) {
      fetchPublicRecord();
    }
  }, [id, fetchPublicRecord]);

  // Development bypass
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

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Password modal
  if (showPasswordModal && publicInfo) {
    return (
      <div className="fixed inset-0 bg-gray-100 dark:bg-gray-950 flex items-start justify-center z-50 px-4 pt-12 sm:pt-20 animate-fadeIn overflow-y-auto">
        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800 animate-scaleIn mb-8">
          {/* Invitation header */}
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

          {/* Split details card */}
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

          {/* Join form */}
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

  // Main content with collapsible sections
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-start justify-center px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <div className="max-w-xl mx-auto py-6 relative w-full z-10">
        {record && !showPasswordModal && (
          <div className="space-y-3">
            {/* Section 1: Split Details */}
            <CollapsibleSection
              id="details"
              title={SECTION_METADATA.details.title}
              collapsedTitle={SECTION_METADATA.details.collapsedTitle}
              isExpanded={expandedSections.includes('details')}
              status={sectionStatuses.details}
              onToggle={handleToggleSection}
              transitionDelay={SECTION_DELAYS.details}
              expandedContent={<SplitDetailExpanded record={record} />}
              collapsedContent={
                <SplitDetailCollapsed
                  record={record}
                  onImageClick={() => setShowEnlargedImage(true)}
                />
              }
            />

            {/* Section 2: Select Name */}
            <CollapsibleSection
              id="name"
              title={SECTION_METADATA.name.title}
              collapsedTitle={SECTION_METADATA.name.collapsedTitle}
              isExpanded={expandedSections.includes('name')}
              status={sectionStatuses.name}
              hasError={nameHasError}
              onToggle={handleToggleSection}
              transitionDelay={SECTION_DELAYS.name}
              expandedContent={
                <SelectNameExpanded
                  record={record}
                  participants={participants}
                  selectedParticipant={selectedParticipant}
                  newParticipantName={newParticipantName}
                  numberOfPax={numberOfPax}
                  onParticipantSelect={handleParticipantSelect}
                  onNewParticipantNameChange={setNewParticipantName}
                  onClearParticipantSelection={() => {
                    setSelectedParticipant(null);
                    setIsUpdatingParticipant(false);
                  }}
                  onProceed={handleNameProceed}
                />
              }
              collapsedContent={
                <SelectNameCollapsed
                  selectedParticipant={selectedParticipant}
                  newParticipantName={newParticipantName}
                />
              }
            />

            {/* Section 3: Amount */}
            <CollapsibleSection
              id="amount"
              title={SECTION_METADATA.amount.title}
              collapsedTitle={SECTION_METADATA.amount.collapsedTitle}
              isExpanded={
                expandedSections.includes('amount') && !isDuplicateName
              }
              status={isDuplicateName ? 'upcoming' : sectionStatuses.amount}
              hasError={amountHasError}
              onToggle={handleToggleSection}
              transitionDelay={SECTION_DELAYS.amount}
              expandedContent={
                <AmountExpanded
                  record={record}
                  participantAmount={participantAmount}
                  setParticipantAmount={setParticipantAmount}
                  selectedParticipant={selectedParticipant}
                  participants={participants}
                  newParticipantName={newParticipantName}
                  onProceed={handleAmountProceed}
                />
              }
              collapsedContent={
                <AmountCollapsed
                  participantAmount={participantAmount}
                  record={record}
                />
              }
            />

            {/* Section 4: Payment */}
            <CollapsibleSection
              id="payment"
              title={SECTION_METADATA.payment.title}
              collapsedTitle={SECTION_METADATA.payment.collapsedTitle}
              isExpanded={
                expandedSections.includes('payment') && !isDuplicateName
              }
              status={isDuplicateName ? 'upcoming' : sectionStatuses.payment}
              onToggle={handleToggleSection}
              transitionDelay={SECTION_DELAYS.payment}
              expandedContent={
                <PaymentExpanded
                  record={record}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  markAsPaid={markAsPaid}
                  setMarkAsPaid={setMarkAsPaid}
                  selectedParticipant={selectedParticipant}
                />
              }
              collapsedContent={
                <PaymentCollapsed
                  selectedPaymentMethod={selectedPaymentMethod}
                />
              }
            />

            {/* Submit Button - appears after payment method selected */}
            <FixedFooter
              isVisible={isFooterVisible}
              isLoading={isSubmitting}
              onSubmit={handleUpdateRecord}
              isUpdate={isUpdatingParticipant}
              successMessage={successMessage}
              isPaid={markAsPaid}
              onReset={resetUIState}
            />
          </div>
        )}

        {/* Error message */}
        {status && !showPasswordModal && !status.includes('success') && (
          <div className="mt-4 text-center animate-fadeIn">
            <p className="px-4 py-3 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              <AlertCircle size={20} className="mr-2" />
              {status}
            </p>
          </div>
        )}
      </div>

      {/* Enlarged image modal */}
      {showEnlargedImage &&
        record?.transaction_images &&
        record.transaction_images.length > 0 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
            onClick={() => setShowEnlargedImage(false)}
          >
            <div className="relative w-[90vw] h-[90vh] max-w-[600px] max-h-[600px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={record.transaction_images[0]?.image_url || ''}
                alt="Enlarged Receipt"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        )}
    </div>
  );
}

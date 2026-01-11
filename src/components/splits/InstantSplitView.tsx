'use client';

import { useState } from 'react';
import { Tables } from '@/lib/database.types';
import { InstantSplitDetailedView } from '@/lib/viewTypes';
import { SelectedPaymentMethod } from '@/components/splits/payment/TabbedPaymentMethods';
import { formatCurrencyAmount } from '@/lib/currencyUtils';
import { PerPaxMetadata, retrieveSettleMetadata } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
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

export interface InstantSplitViewProps {
  record: InstantSplitDetailedView;
  participants: Tables<'one_time_split_expenses_participants'>[];
  /** Called when user saves. Return updated participants or throw error. If not provided, uses mock success. */
  onSave?: (data: {
    participantId?: string;
    name: string;
    amount: string;
    markAsPaid: boolean;
    paymentMethodMetadata: {
      label: string;
      type: string;
      paidAt: string | null;
    } | null;
  }) => Promise<Tables<'one_time_split_expenses_participants'>[]>;
  /** If true, shows a badge indicating test mode */
  isTestMode?: boolean;
}

export default function InstantSplitView({
  record,
  participants: initialParticipants,
  onSave,
  isTestMode = false,
}: InstantSplitViewProps) {
  // Local participants state (can be updated after save)
  const [participants, setParticipants] = useState(initialParticipants);

  // UI state
  const [status, setStatus] = useState('');
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

  const hasSelectedName = !!(selectedParticipant || newParticipantName.trim());
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
    if (isLocked) return;
    toggleSection(sectionId);
  };

  // Handle save/update
  const handleUpdateRecord = async () => {
    setIsSubmitting(true);
    setStatus('');

    try {
      const paymentMethodMetadata = selectedPaymentMethod
        ? {
            label: selectedPaymentMethod.label,
            type: selectedPaymentMethod.type,
            paidAt: markAsPaid ? new Date().toISOString() : null,
          }
        : null;

      const saveData = {
        participantId: isUpdatingParticipant
          ? selectedParticipant?.id
          : undefined,
        name: newParticipantName || selectedParticipant?.name || '',
        amount: participantAmount,
        markAsPaid,
        paymentMethodMetadata,
      };

      if (onSave) {
        // Real save via callback
        const updatedParticipants = await onSave(saveData);
        setParticipants(updatedParticipants);
      }
      // If no onSave (test mode), just show success

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
      setStatus(
        error instanceof Error ? error.message : 'Failed to update record.'
      );
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
    setNewParticipantName('');
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

  // Reset UI state
  const resetUIState = () => {
    setSelectedParticipant(null);
    setNewParticipantName('');
    setMarkAsPaid(false);
    setIsUpdatingParticipant(false);
    setParticipantAmount('');
    setSelectedPaymentMethod(null);
    setSuccessMessage(null);
    goToStep('initial');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-start justify-center px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <div className="max-w-xl mx-auto py-6 relative w-full z-10">
        {/* Test mode badge */}
        {isTestMode && (
          <div className="mb-4 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-medium text-center">
            Test Mode — Changes will not be saved
          </div>
        )}

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
                onProceed={advanceFromName}
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
            isExpanded={expandedSections.includes('amount')}
            status={sectionStatuses.amount}
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
                onProceed={advanceFromAmount}
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
            isExpanded={expandedSections.includes('payment')}
            status={sectionStatuses.payment}
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
              <PaymentCollapsed selectedPaymentMethod={selectedPaymentMethod} />
            }
          />

          {/* Submit Button */}
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

        {/* Error message */}
        {status && (
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

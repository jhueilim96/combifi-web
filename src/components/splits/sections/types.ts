import { Tables } from '@/lib/database.types';
import { InstantSplitDetailedView } from '@/lib/viewTypes';
import { SelectedPaymentMethod } from '@/components/splits/payment/TabbedPaymentMethods';

// Section identifiers
export type SectionId = 'details' | 'name' | 'amount' | 'payment';

// Visual states for sections
export type SectionStatus =
  | 'active' // Currently in focus, full opacity, can be expanded
  | 'completed' // Done, full opacity, collapsed with summary
  | 'upcoming'; // Not yet reached, translucent (40%), blurred hint

// Step names for the flow
export type StepName =
  | 'initial'
  | 'nameSelected'
  | 'amountConfirmed'
  | 'complete';

// Configuration for each step
export interface StepConfig {
  expanded: SectionId[];
  active: SectionId[]; // Which sections are active (not upcoming)
}

// Section state management
export interface SectionState {
  currentStep: StepName;
  manualOverrides: Record<SectionId, boolean>; // User manual toggles
}

// Props for visual styling
export interface SectionVisualProps {
  status: SectionStatus;
  isExpanded: boolean;
  transitionDelay?: string;
}

// Props for CollapsibleSection component
export interface CollapsibleSectionProps {
  id: SectionId;
  title: string;
  isExpanded: boolean;
  status: SectionStatus;
  onToggle: (id: SectionId) => void;
  expandedContent: React.ReactNode;
  collapsedContent: React.ReactNode;
  transitionDelay?: string;
}

// Common props shared across section content components
export interface BaseSectionProps {
  record: InstantSplitDetailedView;
}

// Props for SplitDetailSection
export type SplitDetailSectionProps = BaseSectionProps;

// Props for SelectNameSection
export interface SelectNameSectionProps extends BaseSectionProps {
  participants: Tables<'one_time_split_expenses_participants'>[];
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  newParticipantName: string;
  numberOfPax: number;
  onParticipantSelect: (
    participant: Tables<'one_time_split_expenses_participants'>
  ) => void;
  onNewParticipantNameChange: (name: string) => void;
  onProceed: () => void;
}

// Props for AmountSection
export interface AmountSectionProps extends BaseSectionProps {
  participantAmount: string;
  setParticipantAmount: (amount: string) => void;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
  participants: Tables<'one_time_split_expenses_participants'>[];
  newParticipantName: string;
  onProceed: () => void;
}

// Props for PaymentSection
export interface PaymentSectionProps extends BaseSectionProps {
  selectedPaymentMethod: SelectedPaymentMethod | null;
  setSelectedPaymentMethod: (method: SelectedPaymentMethod | null) => void;
  markAsPaid: boolean;
  setMarkAsPaid: (isPaid: boolean) => void;
  selectedParticipant: Tables<'one_time_split_expenses_participants'> | null;
}

// Props for FixedFooter
export interface FixedFooterProps {
  isVisible: boolean;
  isLoading: boolean;
  onSubmit: () => void;
  isUpdate: boolean;
}

// Return type for useSectionState hook
export interface UseSectionStateReturn {
  currentStep: StepName;
  expandedSections: SectionId[];
  sectionStatuses: Record<SectionId, SectionStatus>;
  toggleSection: (id: SectionId) => void;
  goToStep: (step: StepName) => void;
  advanceFromName: () => void;
  advanceFromAmount: () => void;
  advanceFromPayment: () => void;
}

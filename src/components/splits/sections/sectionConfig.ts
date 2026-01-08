import { SectionId, StepConfig, StepName } from './types';

// Step-based configuration - easily adjustable
export const STEP_CONFIG: Record<StepName, StepConfig> = {
  initial: {
    expanded: ['details', 'name'],
    active: ['details', 'name'], // Amount & Payment are "upcoming" (translucent)
  },
  nameSelected: {
    expanded: ['amount'],
    active: ['details', 'name', 'amount'], // Payment still "upcoming"
  },
  amountConfirmed: {
    expanded: ['payment'],
    active: ['details', 'name', 'amount', 'payment'], // All active now
  },
  complete: {
    expanded: [], // All collapsed, showing summaries
    active: ['details', 'name', 'amount', 'payment'],
  },
};

// Section order for navigation
export const SECTION_ORDER: SectionId[] = [
  'details',
  'name',
  'amount',
  'payment',
];

// Section metadata
export const SECTION_METADATA: Record<
  SectionId,
  { title: string; collapsedTitle: string }
> = {
  details: {
    title: 'Expense Details',
    collapsedTitle: 'Details',
  },
  name: {
    title: 'Select Your Name',
    collapsedTitle: 'Name',
  },
  amount: {
    title: 'Your Amount',
    collapsedTitle: 'Amount',
  },
  payment: {
    title: 'Payment',
    collapsedTitle: 'Payment',
  },
};

// Staggered transition delays for smooth animations
export const SECTION_DELAYS: Record<SectionId, string> = {
  details: '0ms',
  name: '50ms',
  amount: '100ms',
  payment: '150ms',
};

// Helper function to get expanded sections for a step with manual overrides
export function getExpandedSections(
  step: StepName,
  manualOverrides: Record<SectionId, boolean>
): SectionId[] {
  const baseExpanded = STEP_CONFIG[step].expanded;

  // Apply manual overrides
  return SECTION_ORDER.filter((sectionId) => {
    if (manualOverrides[sectionId] !== undefined) {
      return manualOverrides[sectionId];
    }
    return baseExpanded.includes(sectionId);
  });
}

// Helper function to determine section status
export function getSectionStatus(
  sectionId: SectionId,
  step: StepName,
  isExpanded: boolean
): 'active' | 'completed' | 'upcoming' {
  const config = STEP_CONFIG[step];

  // If not in active list, it's upcoming
  if (!config.active.includes(sectionId)) {
    return 'upcoming';
  }

  // If expanded, it's active
  if (isExpanded) {
    return 'active';
  }

  // If in active list but not expanded, it's completed
  return 'completed';
}

// Helper to determine if a section can be toggled
export function canToggleSection(
  sectionId: SectionId,
  step: StepName
): boolean {
  const config = STEP_CONFIG[step];
  // Can only toggle sections that are active (not upcoming)
  return config.active.includes(sectionId);
}

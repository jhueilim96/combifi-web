'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  SectionId,
  SectionStatus,
  StepName,
  UseSectionStateReturn,
} from '@/components/splits/sections/types';
import {
  STEP_CONFIG,
  SECTION_ORDER,
  getExpandedSections,
  canToggleSection,
} from '@/components/splits/sections/sectionConfig';

interface UseSectionStateOptions {
  initialStep?: StepName;
}

export function useSectionState(
  options: UseSectionStateOptions = {}
): UseSectionStateReturn {
  const { initialStep = 'initial' } = options;

  const [currentStep, setCurrentStep] = useState<StepName>(initialStep);
  const [manualOverrides, setManualOverrides] = useState<
    Record<SectionId, boolean>
  >({} as Record<SectionId, boolean>);

  // Calculate expanded sections based on step and manual overrides
  const expandedSections = useMemo(() => {
    return getExpandedSections(currentStep, manualOverrides);
  }, [currentStep, manualOverrides]);

  // Calculate section statuses
  const sectionStatuses = useMemo(() => {
    const statuses: Record<SectionId, SectionStatus> = {} as Record<
      SectionId,
      SectionStatus
    >;
    const config = STEP_CONFIG[currentStep];

    SECTION_ORDER.forEach((sectionId) => {
      // If not in active list, it's upcoming
      if (!config.active.includes(sectionId)) {
        statuses[sectionId] = 'upcoming';
      }
      // If expanded, it's active
      else if (expandedSections.includes(sectionId)) {
        statuses[sectionId] = 'active';
      }
      // If in active list but not expanded, it's completed
      else {
        statuses[sectionId] = 'completed';
      }
    });

    return statuses;
  }, [currentStep, expandedSections]);

  // Toggle a section's expanded state
  const toggleSection = useCallback(
    (sectionId: SectionId) => {
      // Can only toggle sections that are active (not upcoming)
      if (!canToggleSection(sectionId, currentStep)) {
        return;
      }

      setManualOverrides((prev) => {
        const currentlyExpanded = expandedSections.includes(sectionId);
        return {
          ...prev,
          [sectionId]: !currentlyExpanded,
        };
      });
    },
    [currentStep, expandedSections]
  );

  // Go to a specific step
  const goToStep = useCallback((step: StepName) => {
    setCurrentStep(step);
    // Clear manual overrides when changing steps to use default config
    setManualOverrides({} as Record<SectionId, boolean>);
  }, []);

  // Advance from name selection to amount
  const advanceFromName = useCallback(() => {
    setCurrentStep('nameSelected');
    setManualOverrides({} as Record<SectionId, boolean>);
  }, []);

  // Advance from amount to payment
  const advanceFromAmount = useCallback(() => {
    setCurrentStep('amountConfirmed');
    setManualOverrides({} as Record<SectionId, boolean>);
  }, []);

  // Advance from payment to complete
  const advanceFromPayment = useCallback(() => {
    setCurrentStep('complete');
    setManualOverrides({} as Record<SectionId, boolean>);
  }, []);

  return {
    currentStep,
    expandedSections,
    sectionStatuses,
    toggleSection,
    goToStep,
    advanceFromName,
    advanceFromAmount,
    advanceFromPayment,
  };
}

'use client';

import { Loader2, Check } from 'lucide-react';
import { FixedFooterProps } from './types';
import SuccessSection from './SuccessSection';
import PromoBanner from './PromoBanner';

export default function FixedFooter({
  isVisible,
  isLoading,
  onSubmit,
  isUpdate,
  successMessage,
  isPaid = false,
  onReset,
}: FixedFooterProps) {
  if (!isVisible && !successMessage) {
    return null;
  }

  // Success state - hero section + promo banner
  if (successMessage) {
    return (
      <div className="mt-6 space-y-4">
        <SuccessSection
          successMessage={successMessage}
          isPaid={isPaid}
          onReset={onReset}
        />
        <PromoBanner />
      </div>
    );
  }

  return (
    <div className="mt-6 animate-fadeIn">
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-white
          flex items-center justify-center gap-2
          transition-all duration-200
          ${
            isLoading
              ? 'bg-indigo-300 dark:bg-indigo-800 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-[0.98]'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Check size={20} />
            <span>{isUpdate ? 'Update' : 'Save'}</span>
          </>
        )}
      </button>
    </div>
  );
}

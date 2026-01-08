'use client';

import { Loader2, Check } from 'lucide-react';
import { FixedFooterProps } from './types';

export default function FixedFooter({
  isVisible,
  isLoading,
  onSubmit,
  isUpdate,
}: FixedFooterProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Gradient fade effect */}
      <div className="h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />

      {/* Footer content */}
      <div className="bg-white dark:bg-gray-900 px-4 pb-6 pt-2 pointer-events-auto">
        <div className="max-w-xl mx-auto">
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
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98]'
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
      </div>
    </div>
  );
}

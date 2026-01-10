'use client';

import { Check, RotateCcw } from 'lucide-react';

export interface SuccessSectionProps {
  successMessage: string;
  onReset?: () => void;
}

export default function SuccessSection({
  successMessage,
  onReset,
}: SuccessSectionProps) {
  return (
    <div className="animate-fadeIn">
      {/* Section header with separator lines */}
      <div className="w-full flex items-center gap-3 pt-3">
        {/* Left spacer */}
        <div className="w-0 flex-shrink-0" />

        {/* Left line */}
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />

        {/* Centered title */}
        <span className="text-xs font-semibold tracking-wider uppercase px-3 text-gray-900 dark:text-white">
          Complete
        </span>

        {/* Right line */}
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />

        {/* Right spacer to balance */}
        <div className="w-4 flex-shrink-0" />
      </div>

      {/* Success message */}
      <div className="py-3 ">
        <div className="flex items-center justify-center gap-3 py-2 pl-0">
          <Check
            size={20}
            className="text-green-500 dark:text-green-400 flex-shrink-0"
          />
          <span className="font-semibold text-gray-900 dark:text-white text-lg">
            {successMessage}
          </span>
        </div>

        {/* Pay another split button */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-2 flex w-fit mx-auto items-center gap-2 py-2 px-5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 active:scale-[0.98] transition-all duration-200"
          >
            <RotateCcw size={14} />
            <span>Pay another split</span>
          </button>
        )}
      </div>
    </div>
  );
}

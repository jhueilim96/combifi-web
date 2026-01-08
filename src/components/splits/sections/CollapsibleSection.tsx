'use client';

import { ChevronRight } from 'lucide-react';
import { CollapsibleSectionProps } from './types';

export default function CollapsibleSection({
  id,
  title,
  collapsedTitle,
  isExpanded,
  status,
  hasError = false,
  onToggle,
  expandedContent,
  collapsedContent,
  transitionDelay = '0ms',
}: CollapsibleSectionProps) {
  const canToggle = status !== 'upcoming';
  const displayTitle = isExpanded ? title : collapsedTitle || title;

  const handleClick = () => {
    if (canToggle) {
      onToggle(id);
    }
  };

  // Get line color based on status and error state
  const getLineColor = () => {
    if (hasError && !isExpanded && status !== 'upcoming') {
      return 'bg-red-400 dark:bg-red-500';
    }
    if (status === 'active' || isExpanded) {
      return 'bg-indigo-400 dark:bg-indigo-500';
    }
    if (status === 'completed') {
      return 'bg-gray-300 dark:bg-gray-600';
    }
    // Upcoming
    return 'bg-gray-200 dark:bg-gray-700';
  };

  return (
    <div
      className={`
        transition-all duration-500 ease-out
        ${
          status === 'upcoming'
            ? 'opacity-40 pointer-events-none'
            : 'opacity-100'
        }
        ${status === 'upcoming' ? 'blur-[0.5px]' : ''}
      `}
      style={{ transitionDelay }}
    >
      {/* Header - Line with centered title and chevron */}
      <button
        type="button"
        onClick={handleClick}
        disabled={!canToggle}
        className={`
          w-full flex items-center gap-3 py-3
          transition-colors duration-200
          ${canToggle ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        {/* Left spacer to balance chevron - keeps title centered */}
        <div className="w-4 flex-shrink-0" />

        {/* Left line */}
        <div
          className={`
            flex-1 h-px
            transition-colors duration-300
            ${getLineColor()}
          `}
        />

        {/* Centered title */}
        <span
          className={`
            text-xs font-semibold tracking-wider uppercase px-3
            transition-colors duration-200
            ${
              status === 'active'
                ? 'text-gray-900 dark:text-white'
                : status === 'completed'
                  ? 'text-gray-500 dark:text-gray-500'
                  : 'text-gray-400 dark:text-gray-500'
            }
          `}
        >
          {displayTitle}
        </span>

        {/* Right line */}
        <div
          className={`
            flex-1 h-px
            transition-colors duration-300
            ${getLineColor()}
          `}
        />

        {/* Chevron indicator */}
        {canToggle && (
          <div
            className={`
              w-4 flex-shrink-0
              transition-all duration-300 ease-out
              ${isExpanded ? 'rotate-90 text-indigo-500' : 'rotate-0 text-gray-400 dark:text-gray-500'}
            `}
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </div>
        )}
      </button>

      {/* Collapsed Summary - Visible when collapsed and not upcoming */}
      {!isExpanded && status !== 'upcoming' && (
        <div
          className={`
            overflow-hidden
            transition-all duration-300 ease-out
            max-h-24 opacity-100
          `}
        >
          <div className="py-3">{collapsedContent}</div>
        </div>
      )}

      {/* Expanded Content - Visible when expanded */}
      <div
        className={`
          overflow-hidden
          transition-all duration-300 ease-out
          ${
            isExpanded
              ? 'max-h-[2000px] opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          }
        `}
      >
        <div className="py-4">{expandedContent}</div>
      </div>
    </div>
  );
}

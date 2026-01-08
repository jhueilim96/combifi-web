'use client';

import { ChevronDown, Check, Circle } from 'lucide-react';
import { CollapsibleSectionProps } from './types';

export default function CollapsibleSection({
  id,
  title,
  isExpanded,
  status,
  onToggle,
  expandedContent,
  collapsedContent,
  transitionDelay = '0ms',
}: CollapsibleSectionProps) {
  const canToggle = status !== 'upcoming';

  const handleClick = () => {
    if (canToggle) {
      onToggle(id);
    }
  };

  // Status indicator icon
  const StatusIcon = () => {
    if (status === 'completed') {
      return (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      );
    }
    if (status === 'active') {
      return (
        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <Circle size={8} className="text-white fill-white" />
        </div>
      );
    }
    // Upcoming
    return (
      <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
    );
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
      `}
      style={{ transitionDelay }}
    >
      <div
        className={`
          rounded-2xl overflow-hidden
          transition-all duration-300 ease-out
          ${
            isExpanded
              ? 'bg-white dark:bg-gray-900 shadow-sm'
              : 'bg-gray-50 dark:bg-gray-900/50'
          }
          ${status === 'upcoming' ? 'blur-[0.5px]' : ''}
        `}
      >
        {/* Header - Always visible */}
        <button
          type="button"
          onClick={handleClick}
          disabled={!canToggle}
          className={`
            w-full flex items-center justify-between py-4 px-4 text-left
            transition-colors duration-200
            ${
              canToggle
                ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'cursor-default'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <StatusIcon />
            <span
              className={`
              text-sm font-semibold tracking-wide uppercase
              transition-colors duration-200
              ${
                status === 'active'
                  ? 'text-gray-900 dark:text-white'
                  : status === 'completed'
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500'
              }
            `}
            >
              {title}
            </span>
          </div>
          {canToggle && (
            <div
              className={`
              text-gray-400 dark:text-gray-500
              transition-transform duration-300 ease-out
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}
            >
              <ChevronDown size={20} />
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
            <div className="px-4 pb-4">{collapsedContent}</div>
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
          <div className="px-4 pb-6">{expandedContent}</div>
        </div>
      </div>
    </div>
  );
}

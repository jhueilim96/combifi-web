/**
 * Design System Constants
 * Unified styling patterns for Instant Split UI components
 */

/**
 * Container Patterns
 * - Outer containers: Gray background with rounded corners
 * - Inner cards: White background with subtle borders
 */
export const CONTAINER_STYLES = {
  // Outer container (gray background)
  outer: 'bg-gray-50 dark:bg-gray-900 rounded-2xl',

  // Inner card (white background)
  inner: 'bg-white dark:bg-gray-800',

  // Border colors
  border: 'border-gray-100 dark:border-gray-700',
  borderSubtle: 'border-gray-200 dark:border-gray-600',
} as const;

/**
 * Spacing Scale
 * Consistent padding, margins, and gaps
 */
export const SPACING = {
  section: 'space-y-6', // Between major sections
  card: 'p-6', // Card padding
  cardCompact: 'p-4', // Compact card padding
  stack: 'space-y-4', // Stack spacing
  stackTight: 'space-y-3', // Tight stack spacing
  gap: 'gap-3', // Gap between items
} as const;

/**
 * Input Field Styling
 * Consistent border, focus states, and typography
 */
export const INPUT_STYLES = {
  base: 'w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  border: 'border-gray-200 dark:border-gray-600',
  focus: 'focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1',
  error: 'border-red-500 dark:border-red-400',
  errorText: 'text-sm text-red-600 dark:text-red-400 mt-1',
} as const;

/**
 * Button and Toggle Styling
 */
export const BUTTON_STYLES = {
  // Toggle button inactive state
  toggleInactive:
    'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700',

  // Toggle button active state (customizable per context)
  toggleActive: 'font-bold',

  // Primary button
  primary:
    'bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-3 font-medium transition-all duration-200',

  // Secondary button
  secondary:
    'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-3 font-medium transition-all duration-200',
} as const;

/**
 * Icon Container Styling
 * 36x36px rounded squares with subtle backgrounds
 */
export const ICON_CONTAINER = {
  base: 'w-9 h-9 rounded-lg flex items-center justify-center',
  background: 'bg-gray-100 dark:bg-gray-700',
  backgroundLight: 'bg-gray-50 dark:bg-gray-800',
} as const;

/**
 * Section Header Styling
 */
export const HEADER_STYLES = {
  // Uppercase tracking label
  uppercase:
    'text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide',

  // Standard section header
  section: 'flex items-center gap-3 text-gray-600 dark:text-gray-400',

  // Title
  title: 'text-2xl font-medium text-gray-800 dark:text-gray-200',
} as const;

/**
 * Typography
 */
export const TEXT_STYLES = {
  primary: 'text-gray-800 dark:text-gray-200',
  secondary: 'text-gray-600 dark:text-gray-400',
  muted: 'text-gray-500 dark:text-gray-500',
  small: 'text-sm',
  large: 'text-lg',
} as const;

/**
 * Shadow Styles
 */
export const SHADOW = {
  card: 'shadow-lg',
  cardSubtle: 'shadow-md',
  none: 'shadow-none',
} as const;

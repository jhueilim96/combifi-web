'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-lg z-50 
                 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors
                 border border-primary-200 dark:border-primary-800"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        // Sun icon for dark mode (click to switch to light)
        <Sun className="w-6 h-6" />
      ) : (
        // Moon icon for light mode (click to switch to dark)
        <Moon className="w-6 h-6" />
      )}
    </button>
  );
}

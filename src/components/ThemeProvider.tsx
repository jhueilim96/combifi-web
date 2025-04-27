'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Theme = 'light' | 'dark' | 'system';
type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false
}: { 
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  // Initialize with the default theme
  const [theme, setTheme] = useState<Theme>(defaultTheme as Theme);
  
  // Create a wrapper for next-themes' setTheme that also updates our local state
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    // The actual theme change will be handled by next-themes
  };
  
  const contextValue = {
    theme,
    setTheme: handleSetTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider
        attribute={attribute}
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        disableTransitionOnChange={disableTransitionOnChange}
        onValueChange={(newTheme) => setTheme(newTheme as Theme)}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

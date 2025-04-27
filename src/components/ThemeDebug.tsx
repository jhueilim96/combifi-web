'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the ThemePreview component to prevent hydration issues
const ThemePreview = dynamic(() => import('./ThemePreview'), {
  ssr: false,
});

export default function ThemeDebug() {
  const searchParams = useSearchParams();
  const showDebug = searchParams.get('debug') === 'theme';
  
  if (!showDebug) return null;
  
  return <ThemePreview />;
}

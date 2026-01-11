import { notFound } from 'next/navigation';
import { getMockScenario, SCENARIO_KEYS } from './mockData';
import InstantSplitView from '@/components/splits/InstantSplitView';

// Server component - mock data is only loaded here, never sent to client bundle

interface PageProps {
  params: Promise<{ scenario: string }>;
}

export default async function TestSplitPage({ params }: PageProps) {
  const { scenario } = await params;

  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const mockData = getMockScenario(scenario);

  if (!mockData) {
    notFound();
  }

  return (
    <InstantSplitView
      record={mockData.record}
      participants={mockData.participants}
      isTestMode={true}
    />
  );
}

// Generate static params for all scenarios (optional, for better dev experience)
export function generateStaticParams() {
  return SCENARIO_KEYS.map((scenario) => ({ scenario }));
}

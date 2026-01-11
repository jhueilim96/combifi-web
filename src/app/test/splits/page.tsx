import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_SCENARIOS } from './[scenario]/mockData';

// Server component - lists all available test scenarios

export default function TestSplitsIndexPage() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const scenarios = Object.entries(MOCK_SCENARIOS);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Split Test Scenarios
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Test the instant split page with different mock data scenarios.
            Changes are not saved.
          </p>
        </div>

        <div className="space-y-3">
          {scenarios.map(([key, scenario]) => (
            <Link
              key={key}
              href={`/test/splits/${key}`}
              className="block p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-gray-900 dark:text-white">
                    {key}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {scenario.description}
                  </p>
                </div>
                <div className="text-gray-400 dark:text-gray-500">→</div>
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                  {scenario.record.currency} {scenario.record.amount}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                  {scenario.participants.length} participants
                </span>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                  {scenario.record.settle_mode}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

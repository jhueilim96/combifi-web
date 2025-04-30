import { redirect } from 'next/navigation';

export default function Home() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('https://combifi.app');
  }

  // The following code will never run due to the redirect
  // but is kept as a fallback in case the redirect doesn't work
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans">
      <div className="p-8 rounded-lg bg-white shadow-md text-center max-w-xl">
        <h1 className="text-blue-600 mb-4">
          Combifi Development Mode
        </h1>
        <p className="text-lg leading-relaxed">
          This is a placeholder page. In non development environment, should always redirect to {' '}
          <a href="https://combifi.app" className="text-blue-600 underline">
            combifi.app
          </a>
        </p>
      </div>
    </div>
  );
}

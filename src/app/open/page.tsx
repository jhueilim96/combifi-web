import { OpenInApp } from '@/components/common/OpenInApp';

export const runtime = 'edge';

// Where /a/ links the website has no page for land (e.g. /a/go, plan or
// group invites): they are meant for the app.
export default function OpenPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
          This link opens in the Combifi app
        </h1>
        <OpenInApp appPath="a" heading="Open it in the app" />
      </div>
    </main>
  );
}

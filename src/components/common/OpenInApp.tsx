'use client';

import { Smartphone } from 'lucide-react';

const IOS_APP_STORE_URL = 'https://apps.apple.com/app/id6745407096';
const ANDROID_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=app.combifi.app';

/**
 * Opens the same link in the app when it is installed (the OS hands
 * m.combifi.app links to it); otherwise the store links are the next step.
 * There is no deferred deep link: after installing, open the link again.
 */
export function OpenInApp({
  appPath,
  heading = 'Have the Combifi app?',
}: {
  /** The app route for this page, e.g. `a/group/<id>/balance`. */
  appPath: string;
  heading?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3 text-center">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {heading}
      </p>
      <a
        href={`combifi:///${appPath}`}
        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand hover:bg-brand-hover text-ink border border-brand-border rounded-xl font-semibold"
      >
        <Smartphone size={18} />
        Open in Combifi
      </a>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Not installed?{' '}
        <a className="underline" href={IOS_APP_STORE_URL}>
          App Store
        </a>{' '}
        ·{' '}
        <a className="underline" href={ANDROID_PLAY_STORE_URL}>
          Google Play
        </a>
        . After installing, open this link again.
      </p>
    </div>
  );
}

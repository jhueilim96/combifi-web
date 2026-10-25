import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/my/app/combifi/id6745407096';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=app.combifi.app';

/**
 * The "get the app" block shared by the web pages (instant split, settle-up
 * links): the logo, one line on why, the store badges, and for people who
 * already have the app a way to open this page in it.
 */
export default function AppPitch({
  heading,
  body,
  appPath,
}: {
  heading: string;
  body: string;
  /** The app route for this page, e.g. `a/s/<token>`; omit when none. */
  appPath?: string;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-6 py-6 text-center">
      <div className="mx-auto mb-3 w-fit rounded-xl border border-amber-200 bg-amber-100 p-1">
        <Image
          src="/CombifiLogo.svg"
          alt="Combifi"
          width={48}
          height={48}
          className="h-12 w-12"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{heading}</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500">{body}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <Image
            src="/AppStoreDownload.svg"
            alt="Download on the App Store"
            width={140}
            height={42}
            className="h-10 w-auto"
          />
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-80"
        >
          <Image
            src="/PlayStoreDownload.png"
            alt="Get it on Google Play"
            width={140}
            height={40}
            className="h-10 w-auto"
          />
        </a>
      </div>

      {appPath ? (
        <a
          href={`combifi:///${appPath}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-600"
        >
          Already have Combifi? Open in the app
          <ArrowUpRight size={16} />
        </a>
      ) : null}
    </section>
  );
}

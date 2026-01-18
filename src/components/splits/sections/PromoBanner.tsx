'use client';

import Image from 'next/image';

export default function PromoBanner() {
  return (
    <div className="max-w-xs mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-yellow-50 shadow dark:from-indigo-950/30 dark:to-yellow-950/30">
      <div className="px-6 py-5">
        <div className="flex flex-col items-center text-center">
          <div
            className="rounded-xl p-1 mb-3 shadow-xl border border-yellow-200/50"
            style={{ backgroundColor: '#FDF3C8' }}
          >
            <Image
              src="/CombifiLogo.svg"
              alt="Combifi"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            Continue on mobile
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ">
            Track splits and payments automatically. No passwords next time.
          </p>

          <div className="flex flex-col items-center gap-2 mt-4">
            {/* App Store Button */}
            <a
              href="https://apps.apple.com/my/app/combifi/id6745407096"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/AppStoreDownload.svg"
                alt="Download on the App Store"
                width={140}
                height={42}
                className="h-11 w-auto"
              />
            </a>

            {/* Google Play Button */}
            <a
              href="https://play.google.com/store/apps/details?id=app.combifi.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
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
        </div>
      </div>
    </div>
  );
}

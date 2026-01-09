'use client';

import Image from 'next/image';
import { CheckCircle, RotateCcw } from 'lucide-react';

export interface SuccessBannerProps {
  successMessage: string;
  onReset?: () => void;
}

export default function SuccessBanner({
  successMessage,
  onReset,
}: SuccessBannerProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Pay another split button */}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 px-4 rounded-xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          <span>Pay another split</span>
        </button>
      )}

      {/* Success banner with promo */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg relative overflow-hidden">
        {/* Hero: Success message */}
        <div className="flex items-center justify-center gap-3 p-6">
          <CheckCircle size={18} className="text-white flex-shrink-0" />
          <span className="font-bold text-white text-lg">{successMessage}</span>
        </div>

        {/* Footer: Continue on mobile promo */}
        <div className="bg-black/10 px-6 py-5">
          <div className="flex flex-col items-center text-center">
            <div
              className="rounded-xl p-0.5 mb-3"
              style={{ backgroundColor: '#FDF3C8' }}
            >
              <Image
                src="/CombifiLogo.svg"
                alt="Combifi"
                width={52}
                height={52}
                // className="w-10 h-10"
              />
            </div>

            <h3 className="font-semibold text-white ">Try Combifi on mobile</h3>

            <p className="text-white/80 text-sm font-light mt-1 max-w-xs">
              Track splits and payments automatically. No passwords next time.
            </p>

            <div className="flex items-center justify-center gap-3 mt-4">
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
                  width={110}
                  height={30}
                  className="h-10 w-auto"
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
                  width={110}
                  height={30}
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/10 z-0"></div>
        <div className="absolute -right-2 -top-5 h-16 w-16 rounded-full bg-white/10 z-0"></div>
      </div>
    </div>
  );
}

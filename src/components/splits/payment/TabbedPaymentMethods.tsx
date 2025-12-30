'use client';

import { useState } from 'react';
import { QrCode, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import QRCode from './QrCode';

interface TabbedPaymentMethodsProps {
  paymentMethods: Tables<'one_time_split_expenses'>['profiles']['payment_methods'];
  hostName: string;
}

export default function TabbedPaymentMethods({
  paymentMethods,
  hostName,
}: TabbedPaymentMethodsProps) {
  // null = list view, number = selected method index (detail view)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Filter out payment methods without image URLs
  const validPaymentMethods = paymentMethods.filter(
    (method) => method.image_url
  );

  if (validPaymentMethods.length === 0) {
    return null;
  }

  // If only one payment method, show QR directly
  if (validPaymentMethods.length === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <QrCode size={20} />
          </div>
          <span className="text-sm">
            Pay {hostName} with {validPaymentMethods[0].label}
          </span>
        </div>

        <QRCode
          name=""
          qrUrl={validPaymentMethods[0].image_url!}
          provider=""
          embedded
        />
      </div>
    );
  }

  // Detail view - showing QR code for selected method
  if (selectedIndex !== null) {
    const selectedMethod = validPaymentMethods[selectedIndex];
    return (
      <div className="space-y-4">
        {/* Back button */}
        <button
          onClick={() => setSelectedIndex(null)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back to payment methods</span>
        </button>

        <QRCode
          name=""
          qrUrl={selectedMethod.image_url!}
          provider=""
          embedded
        />
      </div>
    );
  }

  // List view - showing all payment methods
  return (
    <div className="space-y-3">
      {/* Header */}
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        Pay {hostName} using
      </p>

      {/* Payment methods list */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
        {validPaymentMethods.map((method, index) => (
          <div key={index}>
            <button
              onClick={() => setSelectedIndex(index)}
              className="flex items-center justify-between w-full h-14 px-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Icon container */}
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <QrCode
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </div>
                {/* Label */}
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {method.label || method.provider}
                </span>
              </div>
              {/* Chevron */}
              <ChevronRight
                size={20}
                className="text-gray-400 dark:text-gray-500"
              />
            </button>
            {/* Divider between items (except last) */}
            {index < validPaymentMethods.length - 1 && (
              <div className="border-t border-gray-100 dark:border-gray-700 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Banknote } from 'lucide-react';
import QRCode from './QRCode';
import { Tables } from '@/lib/database.types';

interface TabbedPaymentMethodsProps {
  paymentMethods: Tables<'one_time_split_expenses'>['profiles']['payment_methods'];
  hostName: string;
}

export default function TabbedPaymentMethods({
  paymentMethods,
  hostName,
}: TabbedPaymentMethodsProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Filter out payment methods without image URLs
  const validPaymentMethods = paymentMethods.filter(
    (method) => method.image_url
  );

  if (validPaymentMethods.length === 0) {
    return null;
  }

  // If only one payment method, don't show tabs
  if (validPaymentMethods.length === 1) {
    return (
      <div className="space-y-4">
        {/* Payment Header */}
        <div className="flex space-x-3 items-center text-gray-600 dark:text-gray-400 mb-4">
          <Banknote size={20} color="grey" />
          <span>
            Pay {hostName} with {validPaymentMethods[0].provider}
          </span>
        </div>

        <div className="space-y-3">
          <QRCode
            name=""
            qrUrl={validPaymentMethods[0].image_url!}
            provider=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Header */}
      <div className="flex space-x-3 items-center text-gray-600 dark:text-gray-400 mb-4">
        <Banknote size={24} color="grey" />
        <span>Pay {hostName} with:</span>
      </div>

      {/* Tab Navigation - similar to PaymentStatusButtonGroup style */}
      <div className="w-4/5 mx-auto">
        <div className="flex">
          {validPaymentMethods.map((method, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 shadow border ${
                index === 0 ? 'rounded-l-lg' : ''
              } ${
                index === validPaymentMethods.length - 1 ? 'rounded-r-lg' : ''
              } ${
                activeTab === index
                  ? 'bg-indigo-100/50 text-gray-900 border-indigo-600 hover:bg-indigo-50/50'
                  : 'bg-white text-gray-400 border-stone-200 hover:bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Image
                  src={`/providers/provider-${method.provider.toLocaleLowerCase()}.svg`}
                  alt={`${method.provider} logo`}
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <span
                  className={`${activeTab === index ? 'font-bold text-indigo-700' : ''}`}
                >
                  {method.provider}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {validPaymentMethods[activeTab]?.image_url && (
          <QRCode
            name=""
            qrUrl={validPaymentMethods[activeTab].image_url!}
            provider=""
          />
        )}
      </div>
    </div>
  );
}

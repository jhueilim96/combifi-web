'use client';

import { useState, useEffect } from 'react';
import { Banknote, Copy, Check, AlertTriangle } from 'lucide-react';
import { Tables } from '@/lib/database.types';
import QRCode from './QrCode';

type PaymentMethod =
  Tables<'one_time_split_expenses'>['profiles']['payment_methods'][number];

type ImagePaymentMethod = PaymentMethod & {
  type: 'IMAGE';
  image_url: string;
  image_key: string;
};

type TextPaymentMethod = PaymentMethod & {
  type: 'TEXT';
  details: string;
};

type ValidPaymentMethod = ImagePaymentMethod | TextPaymentMethod;

function isImagePaymentMethod(
  method: PaymentMethod
): method is ImagePaymentMethod {
  return method.type === 'IMAGE' && !!method.image_url && !!method.image_key;
}

function isTextPaymentMethod(
  method: PaymentMethod
): method is TextPaymentMethod {
  return method.type === 'TEXT' && !!method.details;
}

function isValidPaymentMethod(
  method: PaymentMethod
): method is ValidPaymentMethod {
  return isImagePaymentMethod(method) || isTextPaymentMethod(method);
}

function PaymentDataError() {
  return (
    <div className="py-4">
      <div className="flex justify-center bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
        <div className="min-w-[200px] min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-amber-700 dark:text-amber-400">
            <AlertTriangle size={24} />
            <p className="text-center text-sm">
              Payment details unavailable. Please contact the host directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentDetailsBox({ details }: { details: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="py-4">
      <div className="flex justify-center bg-white p-4 rounded-lg">
        <div className="min-w-[200px] min-h-[200px] flex items-center justify-center">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-center leading-relaxed">
            {details}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 text-sm font-medium"
        >
          {copied ? (
            <>
              <Check size={20} className="mr-2 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={20} className="mr-2" />
              Copy Details
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export type SelectedPaymentMethod = {
  label: string;
  type: string;
};

interface TabbedPaymentMethodsProps {
  paymentMethods: Tables<'one_time_split_expenses'>['profiles']['payment_methods'];
  hostName: string;
  onPaymentMethodChange?: (paymentMethod: SelectedPaymentMethod | null) => void;
  initialPaymentMethodLabel?: string | null;
}

export default function TabbedPaymentMethods({
  paymentMethods,
  hostName,
  onPaymentMethodChange,
  initialPaymentMethodLabel,
}: TabbedPaymentMethodsProps) {
  // Filter valid payment methods first to find initial index
  const validPaymentMethods = paymentMethods.filter(isValidPaymentMethod);

  // Find initial tab index based on label, default to 0 (primary)
  const getInitialTabIndex = () => {
    if (!initialPaymentMethodLabel) return 0;
    const index = validPaymentMethods.findIndex(
      (method) => method.label === initialPaymentMethodLabel
    );
    return index >= 0 ? index : 0;
  };

  const [activeTab, setActiveTab] = useState(getInitialTabIndex);

  // Notify parent of selected payment method when tab changes or on mount
  useEffect(() => {
    if (validPaymentMethods.length > 0 && onPaymentMethodChange) {
      const selectedMethod = validPaymentMethods[activeTab];
      onPaymentMethodChange({
        label: selectedMethod.label,
        type: selectedMethod.type,
      });
    }
  }, [activeTab, validPaymentMethods, onPaymentMethodChange]);

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
            Pay {hostName} with {validPaymentMethods[0].label}
          </span>
        </div>

        <div className="space-y-3">
          {(() => {
            const method = validPaymentMethods[0];
            if (isImagePaymentMethod(method)) {
              return <QRCode name="" qrUrl={method.image_url} provider="" />;
            }
            if (isTextPaymentMethod(method)) {
              return <PaymentDetailsBox details={method.details} />;
            }
            return <PaymentDataError />;
          })()}
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
                {/* {method.label && (
                  <Image
                    src={`/providers/provider-${method.label.toLowerCase()}.svg`}
                    alt={`${method.label} logo`}
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                )} */}
                <span
                  className={`${activeTab === index ? 'font-bold text-indigo-700' : ''}`}
                >
                  {method.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {(() => {
          const activeMethod = validPaymentMethods[activeTab];
          if (isImagePaymentMethod(activeMethod)) {
            return (
              <QRCode name="" qrUrl={activeMethod.image_url} provider="" />
            );
          }
          if (isTextPaymentMethod(activeMethod)) {
            return <PaymentDetailsBox details={activeMethod.details} />;
          }
          return <PaymentDataError />;
        })()}
      </div>
    </div>
  );
}

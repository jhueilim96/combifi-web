'use client';

import { useState, useEffect } from 'react';
import {
  Banknote,
  Copy,
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  QrCode,
  FileText,
} from 'lucide-react';
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
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
        Account Details
      </p>
      <div className="flex items-start bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <p className="flex-1 text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
          {details}
        </p>
        <button
          onClick={handleCopy}
          className={`ml-3 p-2 rounded-lg transition-colors ${
            copied
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500'
          }`}
        >
          {copied ? (
            <Check size={20} className="text-green-600 dark:text-green-400" />
          ) : (
            <Copy size={20} className="text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
      {copied && (
        <p className="text-green-600 dark:text-green-400 text-sm text-center mt-2 font-medium">
          Copied to clipboard
        </p>
      )}
    </div>
  );
}

function PaymentMethodIcon({ type }: { type: string }) {
  if (type === 'IMAGE') {
    return <QrCode size={18} className="text-gray-600 dark:text-gray-400" />;
  }
  return <FileText size={18} className="text-gray-600 dark:text-gray-400" />;
}

export type SelectedPaymentMethod = {
  label: string;
  type: string;
};

interface ListPaymentMethodsProps {
  paymentMethods: Tables<'one_time_split_expenses'>['profiles']['payment_methods'];
  hostName: string;
  onPaymentMethodChange?: (paymentMethod: SelectedPaymentMethod | null) => void;
  initialPaymentMethodLabel?: string | null;
}

export default function ListPaymentMethods({
  paymentMethods,
  hostName,
  onPaymentMethodChange,
  initialPaymentMethodLabel,
}: ListPaymentMethodsProps) {
  const validPaymentMethods = paymentMethods.filter(isValidPaymentMethod);

  // Find initial selected method based on label, or use primary/first
  const getInitialMethod = (): ValidPaymentMethod | null => {
    if (validPaymentMethods.length === 0) return null;

    if (initialPaymentMethodLabel) {
      const found = validPaymentMethods.find(
        (method) => method.label === initialPaymentMethodLabel
      );
      if (found) return found;
    }

    // Default to first
    return validPaymentMethods[0];
  };

  const [selectedMethod, setSelectedMethod] =
    useState<ValidPaymentMethod | null>(getInitialMethod);
  const [showDetails, setShowDetails] = useState(false);

  // Notify parent of selected payment method
  useEffect(() => {
    if (selectedMethod && onPaymentMethodChange) {
      onPaymentMethodChange({
        label: selectedMethod.label,
        type: selectedMethod.type,
      });
    }
  }, [selectedMethod, onPaymentMethodChange]);

  if (validPaymentMethods.length === 0) {
    return null;
  }

  const handleMethodPress = (method: ValidPaymentMethod) => {
    setSelectedMethod(method);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  return (
    <div className="space-y-4">
      {/* Payment Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Banknote size={18} className="text-gray-600 dark:text-gray-400" />
        </div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Pay {hostName} using
        </p>
      </div>

      {/* Content Area */}
      <div className="relative overflow-hidden">
        {/* List View */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showDetails
              ? '-translate-x-full opacity-0 absolute inset-0'
              : 'translate-x-0 opacity-100 relative'
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {validPaymentMethods.map((method, index) => (
              <button
                key={method.label}
                type="button"
                onClick={() => handleMethodPress(method)}
                className={`w-full px-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                  index > 0
                    ? 'border-t border-gray-100 dark:border-gray-700'
                    : ''
                }`}
              >
                <div className="flex items-center h-14">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <PaymentMethodIcon type={method.type} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {method.label}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Details View */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showDetails
              ? 'translate-x-0 opacity-100 relative'
              : 'translate-x-full opacity-0 absolute inset-0'
          }`}
        >
          {selectedMethod && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
              {/* Back Button & Method Header */}
              <div className="flex items-center h-12 mb-2">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {selectedMethod.label}
                  </p>
                </div>
              </div>

              {/* Method Content */}
              {isImagePaymentMethod(selectedMethod) ? (
                <div className="flex flex-col items-center py-2">
                  <QRCode
                    name=""
                    qrUrl={selectedMethod.image_url}
                    provider=""
                  />
                </div>
              ) : isTextPaymentMethod(selectedMethod) ? (
                <PaymentDetailsBox details={selectedMethod.details} />
              ) : (
                <PaymentDataError />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  AlertTriangle,
  ArrowLeft,
  QrCode,
  CheckCircle,
  Landmark,
} from 'lucide-react';
import QRCode from './QrCode';
import RoundedHexagon from '@/components/common/RoundedHexagon';
import { InstantSplitPaymentMethod } from '@/lib/viewTypes';

type PaymentMethod = InstantSplitPaymentMethod;

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
    <div className="py-4 flex flex-col items-center">
      <div className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3">
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed font-medium">
          {details}
        </p>
        <button
          onClick={handleCopy}
          className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
            copied
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          {copied ? (
            <Check size={18} className="text-green-600 dark:text-green-400" />
          ) : (
            <Copy size={18} className="text-gray-400 dark:text-gray-500" />
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
    return <QrCode size={18} className="text-gray-600 dark:text-gray-300" />;
  }
  return <Landmark size={18} className="text-gray-600 dark:text-gray-300" />;
}

export type SelectedPaymentMethod = {
  label: string;
  type: string;
};

interface ListPaymentMethodsProps {
  paymentMethods: InstantSplitPaymentMethod[];
  hostName: string;
  onPaymentMethodChange?: (paymentMethod: SelectedPaymentMethod | null) => void;
  initialPaymentMethodLabel?: string | null;
}

export default function ListPaymentMethods({
  paymentMethods,
  onPaymentMethodChange,
  initialPaymentMethodLabel,
}: ListPaymentMethodsProps) {
  const validPaymentMethods = paymentMethods.filter(isValidPaymentMethod);

  // Find initial selected method based on label, or null by default
  const getInitialMethod = (): ValidPaymentMethod | null => {
    if (validPaymentMethods.length === 0) return null;

    // Only pre-select if there's an initial label provided
    if (initialPaymentMethodLabel) {
      const found = validPaymentMethods.find(
        (method) => method.label === initialPaymentMethodLabel
      );
      if (found) return found;
    }

    // Default to no selection
    return null;
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
    <div className="mb-6">
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
          <div className="flex justify-center">
            <div className="space-y-2">
              {validPaymentMethods.map((method) => {
                const isSelected = selectedMethod?.label === method.label;
                return (
                  <div
                    key={method.label}
                    onClick={() => handleMethodPress(method)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[1.7rem] cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-2 border-indigo-500 dark:border-indigo-400'
                        : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <RoundedHexagon bgClassName="text-gray-100 dark:text-gray-800">
                      <PaymentMethodIcon type={method.type} />
                    </RoundedHexagon>
                    <div className="flex flex-col min-w-32">
                      <span className="text-gray-900 dark:text-white font-medium">
                        {method.label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {method.type === 'IMAGE'
                          ? 'QR Code'
                          : 'Account Details'}
                      </span>
                    </div>
                    {/* Always reserve space for checkmark */}
                    <div className="w-5 h-5 flex-shrink-0">
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
            <div className="rounded-2xl">
              {/* Method Header with Back Button */}
              <button
                type="button"
                onClick={handleBackToList}
                className="flex items-center justify-center gap-3 w-full group"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                  className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors"
                />
                <RoundedHexagon>
                  <PaymentMethodIcon type={selectedMethod.type} />
                </RoundedHexagon>
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {selectedMethod.label}
                </span>
              </button>

              {/* Method Content */}
              {isImagePaymentMethod(selectedMethod) ? (
                <div className="flex flex-col items-center">
                  <QRCode name="" qrUrl={selectedMethod.image_url} />
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

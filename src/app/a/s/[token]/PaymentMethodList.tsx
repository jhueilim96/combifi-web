'use client';

import { useState } from 'react';
import { Check, ChevronDown, Copy, FileText, QrCode } from 'lucide-react';

import QRCode from '@/components/splits/payment/QrCode';
import type { SharePaymentMethod } from './data';

const isUsable = (method: SharePaymentMethod) =>
  (method.type === 'IMAGE' && !!method.image_url) ||
  (method.type === 'TEXT' && !!method.details);

/**
 * The sharer's payment methods as a list: any number fits, and tapping a
 * row opens its QR code or account details. The preferred one starts open.
 */
export default function PaymentMethodList({
  methods,
}: {
  methods: SharePaymentMethod[];
}) {
  const usable = methods.filter(isUsable);
  const [openIndex, setOpenIndex] = useState<number | null>(
    usable.length > 0 ? 0 : null
  );

  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {usable.map((method, index) => {
        const isOpen = openIndex === index;
        const Icon = method.type === 'IMAGE' ? QrCode : FileText;
        return (
          <li key={`${method.label}-${index}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={`${method.label}${method.is_primary ? ' (preferred)' : ''}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Icon size={18} className="text-gray-600" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-gray-900">
                  {method.label}
                </span>
                {method.is_primary ? (
                  <span className="block text-xs text-indigo-500">
                    Preferred
                  </span>
                ) : null}
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen ? (
              <div className="px-4 pb-4">
                {method.type === 'IMAGE' && method.image_url ? (
                  <QRCode name="" qrUrl={method.image_url} />
                ) : (
                  <AccountDetails details={method.details ?? ''} />
                )}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function AccountDetails({ details }: { details: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-100 p-4">
      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-gray-900">
        {details}
      </p>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy account details"
        className="shrink-0 rounded-lg bg-white p-2 text-gray-600 hover:text-gray-900"
      >
        {copied ? (
          <Check size={18} className="text-green-600" />
        ) : (
          <Copy size={18} />
        )}
      </button>
    </div>
  );
}

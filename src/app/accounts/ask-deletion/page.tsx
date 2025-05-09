'use client';

import { useState } from 'react';
import { requestAccountDeletion } from './actions';
import { Button } from '@/components/ui/Button';

export default function AskDeletion() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setStatus('Submitting your request...');

    try {
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await requestAccountDeletion(email);

      setStatus(
        'Request submitted successfully. We will send you an email with further instructions.'
      );
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      setStatus('Failed to submit deletion request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-br from-indigo-500 via-indigo-400 to-purple-500 dark:from-indigo-700 dark:via-indigo-600 dark:to-purple-800"
          style={{
            height: 'calc(180px + 8vh)',
            clipPath: 'ellipse(150% 100% at 50% 0%)',
          }}
        />
      </div>

      {/* Content container */}
      <div className="max-w-xl mx-auto px-4 py-8 absolute top-0 w-full">
        {/* Main content card */}
        <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 mt-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Account Deletion Request
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                We&apos;re sorry to see you go.
                <br />
                Please enter the email address associated with your account.
                We&apos;ll send you an email with instructions to confirm and
                complete the deletion process.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="w-full rounded-lg py-3 px-4 border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                text="Request Account Deletion"
                loadingText="Submitting..."
              />
            </div>
          </form>
        </div>

        {/* Status message */}
        {status && !isLoading && (
          <div className="mt-4 text-center animate-fadeIn">
            <p
              className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                status.includes('success')
                  ? 'bg-green-100 border border-green-200 text-green-700'
                  : 'bg-red-100 border border-red-200 text-red-700'
              }`}
            >
              {status.includes('success') ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {status}
            </p>
          </div>
        )}
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        .running-loader {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto;
          text-align: center;
        }

        .runner {
          width: 20px;
          height: 20px;
          background-color: #4f46e5;
          border-radius: 50%;
          position: absolute;
          top: 30px;
          left: 0;
          animation:
            run 0.5s linear infinite,
            bounce 0.5s ease-in-out infinite;
        }

        .ground {
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: #dcdcdc;
          overflow: hidden;
        }

        .ground::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 4px;
          background: repeating-linear-gradient(
            90deg,
            #ccc,
            #ccc 10px,
            #eee 10px,
            #eee 20px
          );
          animation: moveGround 1s linear infinite;
        }

        .loading-text {
          bottom: 0;
          left: 0;
          width: 100%;
          font-size: 14px;
          color: #f1f1f1;
          font-weight: 600;
          margin-top: 3rem;
        }

        @keyframes run {
          0% {
            left: 0;
          }
          100% {
            left: calc(100% - 20px);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            top: 30px;
          }
          50% {
            top: 10px;
          }
        }

        @keyframes moveGround {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

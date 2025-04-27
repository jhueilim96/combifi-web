'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getRecord, getParticipantRecords, updateParticipantRecord } from './actions';
import { Tables } from '@/lib/database.types';

export const runtime = 'edge';

export default function RecordPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [record, setRecord] = useState<Tables<'one_time_split_expenses'> | null>(null);
  const [participants, setParticipants] = useState<Tables<'one_time_split_expenses_participants'>[]>([]);
  const [password, setPassword] = useState('');
  const [participantAmount, setParticipantAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);

  const fetchRecord = async () => {
    if (!id || !password) return;
    
    setIsLoading(true);
    setStatus('Fetching...');
    
    try {
      const data = await getRecord(id, password);
      const participantsData = await getParticipantRecords(id, password);
      setRecord(data);
      setParticipants(Array.isArray(participantsData) ? participantsData : [participantsData]);
      // Get amount from the first participant or default to 0
      setParticipantAmount(participantsData[0]?.amount.toFixed(2) || '0.00');
      setShowPasswordModal(false);
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to fetch record.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRecord = async () => {
    if (!id || !password) return;
    
    setIsLoading(true);
    setStatus('Updating...');
    
    try {
      await updateParticipantRecord(id, password, participantAmount);
      setStatus('Updated successfully!');
      setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to update record.');
    } finally {
      setIsLoading(false);
    }
  };

  const openTitleModal = () => setShowTitleModal(true);
  const openAmountModal = () => setShowAmountModal(true);

  if (!id) {
    return <div className="p-4 text-gray-800 dark:text-gray-200">No record ID provided.</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="running-loader">
          <div className="runner" />
          <div className="ground" />
          <p className="loading-text">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Compute display values
  const hostParticipant = participants.find(p => p.is_host);
  const displayTitle = record?.description || '';
  const displayAmount = record?.amount.toFixed(2) || '0.00';

  if (showPasswordModal) { 
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-100 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-scaleIn">
          <div className="flex flex-col justify-center items-center">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-full p-5 mb-6 shadow-md">
              <div className="w-[4rem] h-[4rem] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-indigo-600 dark:text-indigo-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Enter Password</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-7">Please enter the password to access this instant split.</p>
            
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5 shadow-sm transition-all duration-200"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={fetchRecord}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md"
            >
              Access Record
            </button>
            
            {status && (
              <div className="mt-4 w-full">
                <p className="px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center">{status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Gradient background with Vue-style colors */}
      <div
        className="absolute top-0 left-0 w-full bg-gradient-to-r from-indigo-400 to-indigo-500 dark:from-indigo-600 dark:to-indigo-700"
        style={{ height: 'calc(180px + 5vh)' }}
      />
      <div
        className="absolute top-[calc(180px+5vh)] left-0 w-full bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800"
        style={{ height: '100%' }}
      />
      
      {/* Content container with spacing matching Vue page */}
      <div className="max-w-xl mx-auto px-4 py-8 absolute top-0 w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Split and Pay
          </h1>
          <p className="text-white text-base mb-2">
            <b>{hostParticipant?.name || 'Someone'}</b> has invited you to settle a <br/> shared expense
          </p>
        </div>

        

        {/* Main content when record is available with improved card styling */}
        {record && !showPasswordModal && (
          <>
            {/* Record card with enhanced shadows and gradients */}
            <div className="border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col space-y-4 mb-6">
              <div className="flex justify-between items-center space-x-6">
                <div className="text-left overflow-hidden">
                  <h2
                    className="text-sm text-gray-700 dark:text-gray-300 font-normal truncate cursor-pointer max-w-[10rem]"
                    onClick={openTitleModal}
                  >
                    {record.description || 'Untitled Split'}
                  </h2>
                  
                  {/* Title Modal */}
                  {showTitleModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full animate-scaleIn">
                        <div className="flex flex-col justify-center items-center">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
                            <div className="w-[4rem] h-[4rem] m-3 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Title</h2>
                          <p className="text-sm font-base text-gray-400 dark:text-gray-500 mb-4">Review the title below and confirm.</p>
                          <div className="w-full px-5">
                            <input
                              type="text"
                              className="w-full text-xl font-semibold text-gray-700 dark:text-gray-300 p-3 mb-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                              value={displayTitle}
                              disabled
                            />
                            <button
                              onClick={() => setShowTitleModal(false)}
                              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-[2rem] transition-colors duration-200"
                            >
                              Got It!
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-baseline cursor-pointer" onClick={openAmountModal}>
                    <span className="text-[2.5rem] font-semibold text-gray-800 dark:text-gray-200 tracking-tight truncate overflow-hidden max-w-[10rem]">
                      ${displayAmount}
                    </span>
                  </div>
                  
                  {/* Amount Modal */}
                  {showAmountModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full animate-scaleIn">
                        <div className="flex flex-col justify-center items-center">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
                            <div className="w-[4rem] h-[4rem] m-3 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Amount!</h2>
                          <p className="text-sm font-base text-gray-400 dark:text-gray-500 mb-4">Review the amount below and confirm.</p>
                          <div className="w-full px-5">
                            <div className="relative mb-4">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                              <input
                                type="text"
                                className="w-full text-xl font-semibold text-gray-700 dark:text-gray-300 p-3 pl-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                                value={displayAmount}
                                disabled
                              />
                            </div>
                            <button
                              onClick={() => setShowAmountModal(false)}
                              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-[2rem] transition-colors duration-200"
                            >
                              Got It!
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-baseline">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Date: {new Date(record.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col justify-center items-center">
                  {record.file_name ? (
                    <img
                      src={`/images/${record.file_name}`}
                      alt="Receipt Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <p className="text-gray-400 dark:text-gray-500 text-[0.75rem] font-extralight">
                        No Image
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Participants section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 bg-white dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-300 text-md font-semibold text-center mb-2 pb-2">
                Identify yourself
              </p>
              <div className="max-h-80 overflow-y-auto border rounded-2xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                {participants.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                        onClick={() => setParticipantAmount(participant.amount.toFixed(2))}
                      >
                        <span className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{participant.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No participants found
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-center my-6">
              Not found? Enter your name below
            </p>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-xl py-3 px-4 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <button
              className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg"
              onClick={handleUpdateRecord}
            >
              Join Expense
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Make sure to verify your details before confirming
            </p>
          </>
        )}
        
        {/* Status message with improved styling */}
        {status && !showPasswordModal && (
          <div className="mt-4 text-center animate-fadeIn">
            <p className={`px-4 py-3 rounded-lg flex items-center justify-center ${status.includes('success') 
              ? 'bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
              : 'bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
              {status.includes('success') ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {status}
            </p>
          </div>
        )}
      </div>
      
      {/* Add custom loader styling */}
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
          background-color: #4F46E5;
          border-radius: 50%;
          position: absolute;
          top: 30px;
          left: 0;
          animation: run 0.5s linear infinite, bounce 0.5s ease-in-out infinite;
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
          color: #4a4a4a;
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
          0%, 100% {
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

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

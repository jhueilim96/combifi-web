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

  const openRecordModal = () => setShowRecordModal(true);
  const closeRecordModal = () => setShowRecordModal(false);

  if (!id) {
    return <div className="p-4 text-gray-800 dark:text-gray-200">No record ID provided.</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Gradient background with enhanced colors */}
      <div
        className="absolute top-0 left-0 w-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 dark:from-primary-700 dark:via-primary-600 dark:to-primary-700"
        style={{ height: 'calc(200px + 5vh)' }}
      />
      <div
        className="absolute top-[calc(200px+5vh)] left-0 w-full bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800"
        style={{ height: '100%' }}
      />
      
      {/* Content container with improved spacing */}
      <div className="max-w-xl mx-auto px-4 py-10 absolute top-0 w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-50 dark:text-gray-100 mb-3">
            Instant Split
          </h1>
          <p className="text-gray-100 dark:text-gray-200 text-base mb-2">
            View and manage your split expense
          </p>
        </div>

        {/* Password Modal with improved styling and animations */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-scaleIn">
              <div className="flex flex-col justify-center items-center">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-full p-5 mb-6 shadow-md">
                  <div className="w-[4rem] h-[4rem] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-primary-600 dark:text-primary-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Enter Password</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-7">Please enter the password to access this split expense record.</p>
                
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-5 shadow-sm transition-all duration-200"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  onClick={fetchRecord}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 dark:from-primary-600 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md"
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
        )}

        {/* Main content when record is available with improved card styling */}
        {record && !showPasswordModal && (
          <>
            {/* Record card with enhanced shadows and gradients */}
            <div className="bg-white dark:bg-gray-800 border-none rounded-2xl shadow-xl p-5 flex flex-col space-y-4 mb-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex justify-between items-center space-x-6">
                <div className="text-left overflow-hidden">
                  <h2 className="text-xl text-gray-700 dark:text-gray-200 font-semibold">
                    {record.title || 'Untitled Split'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Created at: {new Date(record.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${record.total_amount?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Total amount
                  </p>
                </div>
              </div>
            </div>

            {/* Participants section with improved styling */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Participants
              </h2>
              
              {participants.length > 0 ? (
                <div className="space-y-3">
                  {participants.map((participant, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-650 transition-colors duration-200"
                    >
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{participant.name || `Participant ${index + 1}`}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">${participant.amount?.toFixed(2) || '0.00'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No participants found</p>
                </div>
              )}
            </div>

            {/* Your Share section with improved UI */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                Your Share
              </h2>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600 dark:text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                    value={participantAmount}
                    onChange={(e) => setParticipantAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <button
                onClick={handleUpdateRecord}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 dark:from-primary-600 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 font-medium shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>

            {/* Record details with improved collapsible UI */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Record Details
                </h2>
                <button 
                  onClick={() => setShowRecordModal(!showRecordModal)}
                  className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center transition-colors duration-200"
                >
                  {showRecordModal ? (
                    <>
                      <span className="mr-1">Hide</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span className="mr-1">Show</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              {showRecordModal && (
                <div className="animate-fadeIn">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Record Data:</h3>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto max-h-60 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                      {JSON.stringify(record, null, 2)}
                    </pre>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Participants:</h3>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto max-h-60 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                      {JSON.stringify(participants, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
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
    </div>
  );
}

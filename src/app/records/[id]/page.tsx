'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { getRecord, getRecordParticipants, Participant, updateRecord } from './actions';

export const runtime = 'edge';

export default function RecordPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [record, setRecord] = useState(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [password, setpassword] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const fetchRecord = async () => {
    if (!id || !password) return;
    
    setStatus('Fetching...');
    
    try {
      const data = await getRecord(id, password);
      const participantsData = await getRecordParticipants(id, password);
      setRecord(data);
      setParticipants(participantsData);
      setContent(data.content);
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to fetch record.');
    }
  };

  const handleUpdateRecord = async () => {
    if (!id || !password) return;
    
    setStatus('Updating...');
    
    try {
      await updateRecord(id, password, content);
      setStatus('Updated successfully!');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to update record.');
    }
  };

  if (!id) {
    return <div className="p-4">No record ID provided.</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">View Record</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Enter password to access"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />
      <button onClick={fetchRecord} className="bg-blue-500 text-white px-4 py-2 rounded">
        Fetch Record
      </button>

      {record && (
        <div className="mt-4">
          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-2">Record Data:</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-100 text-sm">
              {JSON.stringify(record, null, 2)}
            </pre>
          </div>
          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-2">Participants:</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-100 text-sm">
              {JSON.stringify(participants, null, 2)}
            </pre>
          </div>
          <textarea
            className="border p-2 w-full h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={handleUpdateRecord}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      )}
      

      {status && <p className="mt-4 text-red-600">{status}</p>}
    </div>
  );
}

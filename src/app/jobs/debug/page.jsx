'use client';

import { useEffect, useState } from 'react';

export default function JobDataDebug() {
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJSON = async () => {
      try {
        const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const json = await res.json();
        setJobData(json);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJSON();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">Raw Job Data (Debug View)</h1>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : jobData ? (
        <pre className="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded overflow-auto max-h-[600px]">
          {JSON.stringify(jobData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
}

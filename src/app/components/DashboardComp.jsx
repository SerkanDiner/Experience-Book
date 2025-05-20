'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function DashboardComp() {
  const { user } = useUser();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/newsletter/feedback");
        const data = await res.json();
        if (data.success) {
          setFeedbackList(data.feedback);
        }
      } catch (error) {
        console.error("Error loading feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold dark:text-white">
        {user?.publicMetadata?.isAdmin ? 'Admin Dashboard' : 'Your Dashboard'}
      </h2>

      {/* Submitted Feedback */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold dark:text-white">Submitted Feedback</h3>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {feedbackList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No feedback submitted yet.</p>
          ) : (
            feedbackList.map((fb) => (
              <div 
                key={fb._id} 
                className="border border-gray-200 dark:border-gray-700 p-3 rounded-md"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-orange-500">{fb.title || "Untitled"}</h4>
                  <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-200">{fb.feedback}</p>
                <p className="text-sm text-gray-500 mt-1">Rating: {fb.rating || "N/A"} • Category: {fb.category}</p>
                <p className="text-sm text-gray-400">Submitted by: {fb.email}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

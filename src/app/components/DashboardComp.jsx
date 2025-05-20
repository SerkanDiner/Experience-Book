'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { FaUserShield, FaEnvelope, FaStar, FaTag, FaClock } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';

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
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h2>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <FaUserShield className="text-orange-500" />
          <span>Welcome back, {user?.firstName || 'Admin'}</span>
        </div>
      </header>

      {/* Feedback Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
            <MdFeedback className="mr-2 text-orange-500" />
            Submitted Feedbacks
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: {feedbackList.length}
          </span>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {feedbackList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No feedback submitted yet.</p>
          ) : (
            feedbackList.map((fb) => (
              <div
                key={fb._id}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg hover:shadow transition"
              >
                {/* Title & Date */}
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-orange-500">{fb.title || "Untitled"}</h4>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <FaClock /> {new Date(fb.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Feedback Body */}
                <p className="text-gray-700 dark:text-gray-200 line-clamp-3">{fb.feedback}</p>

                {/* Details Row */}
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    <FaEnvelope /> {fb.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar /> Rating: {fb.rating || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaTag /> Category: {fb.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

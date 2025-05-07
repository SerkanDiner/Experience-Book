'use client';

import { useState } from 'react';
import JobReviewForm from './JobReviewForm';

export default function JobReviewModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🔘 Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded shadow"
      >
        ✍️ Submit a Job Review
      </button>

      {/* 🪟 Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            {/* ❌ Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>

            {/* 📝 Form */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              Submit a Job Review
            </h2>
            <JobReviewForm onSubmitComplete={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

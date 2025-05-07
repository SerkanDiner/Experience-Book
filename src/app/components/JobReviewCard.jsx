'use client';

import { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';

export default function JobReviewCard({ review }) {
  const [xp, setXp] = useState(review.xp);
  const [agrees, setAgrees] = useState(review.agrees);
  const [disagrees, setDisagrees] = useState(review.disagrees);
  const [voted, setVoted] = useState(false); // local-only voting lock

  const handleVote = async (type) => {
    if (voted) return;

    try {
      const res = await fetch(`/api/jobReview/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review._id, vote: type }),
      });

      if (res.ok) {
        if (type === 'agree') {
          setXp(xp + 10);
          setAgrees(agrees + 1);
        } else {
          setXp(xp - 5);
          setDisagrees(disagrees + 1);
        }
        setVoted(true);
      }
    } catch (err) {
      console.error('Voting failed:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 space-y-3 transition-all">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {review.jobTitle}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400">{review.country}</p>

      <p className="text-sm text-gray-700 dark:text-gray-300">
        💰 <strong>{review.monthlySalary.toLocaleString()}</strong> / month
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="flex items-center gap-1 text-orange-500 font-medium">
          <FaStar className="w-4 h-4" /> XP: {xp}
        </span>
        <div className="flex gap-3">
          <button
            disabled={voted}
            onClick={() => handleVote('agree')}
            className="flex items-center gap-1 text-sm text-green-600 hover:underline"
          >
            <FaThumbsUp className="w-4 h-4" /> {agrees}
          </button>
          <button
            disabled={voted}
            onClick={() => handleVote('disagree')}
            className="flex items-center gap-1 text-sm text-red-500 hover:underline"
          >
            <FaThumbsDown className="w-4 h-4" /> {disagrees}
          </button>
        </div>
      </div>
    </div>
  );
}

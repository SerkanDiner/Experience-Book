'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaThumbsUp, FaThumbsDown, FaCrown } from 'react-icons/fa';
import JobReviewForm from '../components/JobReviewForm';

const tips = [
  '💡 Tip: Vote once a day to keep things fair!',
  '🎯 Did this job help someone? Give it a boost!',
  '📣 The job with most XP gets featured!',
  '🔥 Hot take? Vote it up!',
];

export default function JobStatsPage() {
  const [reviews, setReviews] = useState([]);
  const [voteMessage, setVoteMessage] = useState('');
  const [tip, setTip] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/jobReview', { cache: 'no-store' });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch job reviews', err);
    }
  };

  const showMessage = (msg) => {
    setVoteMessage(msg);
    setTimeout(() => setVoteMessage(''), 3000);
  };

  const handleVote = async (id, type) => {
    const voteKey = `job-vote-${id}`;
    const today = new Date().toISOString().split('T')[0];
    const storedVote = JSON.parse(localStorage.getItem(voteKey)) || {};

    if (storedVote[type] === today) {
      showMessage(
        type === 'agree'
          ? '👍 You’ve already supported this job today. Come back tomorrow!'
          : '👎 You already voted against this one today. Try again tomorrow!'
      );
      return;
    }

    try {
      const res = await fetch('/api/jobReview/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, vote: type }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === id
              ? {
                  ...r,
                  xp: r.xp + (type === 'agree' ? 10 : -5),
                  agrees: r.agrees + (type === 'agree' ? 1 : 0),
                  disagrees: r.disagrees + (type === 'disagree' ? 1 : 0),
                }
              : r
          )
        );

        localStorage.setItem(
          voteKey,
          JSON.stringify({ ...storedVote, [type]: today })
        );
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const sorted = [...reviews].sort((a, b) => b.xp - a.xp);

  const handleNewReview = (newReview) => {
    setReviews((prev) => [...prev, newReview]);
    setShowForm(false);
    setTip('✅ Thanks for your input! Your review has been added.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 relative">
      {/* 🏆 Header with Explanation */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">
          Job XP Leaderboard
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-base leading-relaxed mb-3">
          Welcome to the <strong>Job XP Leaderboard</strong> — a community-powered system that ranks job reviews
          based on feedback. See which jobs are most appreciated, get insights from real salaries, and help others
          by voting.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{tip}</p>
      </div>

      {/* 💬 Vote Feedback Message */}
      {voteMessage && (
        <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-4 rounded-lg shadow-lg border border-orange-400">
          {voteMessage}
        </div>
      )}

      {/* ✍️ Submit Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-md shadow"
        >
          ✍️ Share Your Job Experience
        </button>
      </div>

      {/* 🪟 Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl p-6 max-w-xl w-full shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              className="absolute top-2 right-3 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500"
              onClick={() => setShowForm(false)}
            >
              ✖ Close
            </button>
            <JobReviewForm onSubmitComplete={handleNewReview} />
          </div>
        </div>
      )}

      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Job Title</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Salary</th>
              <th className="px-4 py-3 text-left">XP</th>
              <th className="px-4 py-3 text-left">👍</th>
              <th className="px-4 py-3 text-left">👎</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((review, index) => (
              <tr
                key={review._id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium flex items-center gap-1">
                  {index + 1}
                  {index === 0 && <FaCrown className="text-yellow-500 ml-1 w-4 h-4" />}
                </td>
                <td className="px-4 py-3">{review.jobTitle}</td>
                <td className="px-4 py-3">{review.country}</td>
                <td className="px-4 py-3">€ {review.monthlySalary.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-500 flex items-center gap-1">
                  <FaStar className="w-4 h-4" /> {review.xp}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleVote(review._id, 'agree')}
                    className="text-green-600 flex items-center gap-1 hover:underline"
                  >
                    <FaThumbsUp className="w-4 h-4" /> {review.agrees}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleVote(review._id, 'disagree')}
                    className="text-red-500 flex items-center gap-1 hover:underline"
                  >
                    <FaThumbsDown className="w-4 h-4" /> {review.disagrees}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

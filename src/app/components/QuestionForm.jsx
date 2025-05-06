'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

const QuestionForm = ({ profileId, onNewQuestion }) => {
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // ✅ for user feedback
  const [isError, setIsError] = useState(false);

  if (!user) {
    return (
      <p className="text-sm text-red-500 mb-4 text-center">
        Please sign in to ask a question.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setSubmitting(true);
    setMessage(null);
    setIsError(false);

    const newQuestion = {
      profileId,
      userId: user.id,
      userName: user.fullName || null,
      userEmail: user.primaryEmailAddress?.emailAddress,
      userAvatar: user.imageUrl,
      question,
    };

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });

      const data = await res.json();

      if (res.ok && data?.question) {
        setQuestion('');
        setMessage('✅ Question submitted successfully!');
        onNewQuestion(data.question);
      } else {
        setIsError(true);
        setMessage(data?.message || '❌ Failed to submit your question');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsError(true);
      setMessage('❌ An unexpected error occurred.');
    } finally {
      setSubmitting(false);
      // Auto-hide message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      {message && (
        <div
          className={`text-sm px-4 py-2 rounded-md ${
            isError
              ? 'bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-300'
              : 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-300'
          }`}
        >
          {message}
        </div>
      )}

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question..."
        rows="3"
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-zinc-800 dark:text-white"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
      >
        {submitting ? 'Sending...' : 'Submit Question'}
      </button>
    </form>
  );
};

export default QuestionForm;

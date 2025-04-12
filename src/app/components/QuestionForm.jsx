'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

const QuestionForm = ({ postId, onNewQuestion }) => {
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setSubmitting(true);

    const newQuestion = {
      postId,
      userId: user?.id,
      userName: user?.fullName || null,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userAvatar: user?.imageUrl,
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
        onNewQuestion(data.question); // ✅ Live update parent list
      } else {
        console.error('Failed to submit question:', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
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

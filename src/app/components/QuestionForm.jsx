'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

const QuestionForm = ({ profileId, onNewQuestion }) => {
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
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
    const trimmedQuestion = question.trim();

    if (!profileId || !user.id || !trimmedQuestion) {
      setIsError(true);
      setMessage('❗ All fields are required. Please try again.');
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setIsError(false);

    const newQuestion = {
      profileId,
      userId: user.id,
      userName: user.fullName || null,
      userEmail: user.primaryEmailAddress?.emailAddress,
      userAvatar: user.imageUrl,
      question: trimmedQuestion,
    };

    console.log('📤 Submitting question payload:', newQuestion);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON:', jsonError);
        setIsError(true);
        setMessage('There was a problem communicating with the server.');
        return;
      }

      if (res.ok && data?.question) {
        setQuestion('');
        setIsError(false);
        setMessage('✅ Question submitted successfully!');
        onNewQuestion(data.question);
      } else {
        console.error('❌ Submission failed:', data?.message || 'Unknown error');
        setIsError(true);
        setMessage(data?.message || 'Failed to submit your question.');
      }
    } catch (fetchError) {
      console.error('❌ Network error:', fetchError);
      setIsError(true);
      setMessage('Network error: Unable to submit your question.');
    } finally {
      setSubmitting(false);
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

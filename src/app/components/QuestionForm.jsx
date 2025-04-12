'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const QuestionForm = ({ postId }) => {
  const { user } = useUser();
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please sign in to ask a question.');
      return;
    }

    if (!question.trim()) {
      setMessage('Question cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: user.id,
          userName: user.fullName,
          userEmail: user.primaryEmailAddress.emailAddress,
          userAvatar: user.imageUrl,
          question,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Question submitted!');
        setQuestion('');
        router.refresh(); // Refresh the page to show new question
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-md bg-white dark:bg-zinc-900">
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Ask a Question:</label>
        <textarea
          className="w-full p-2 border rounded-md dark:bg-zinc-800"
          rows="3"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to know?"
        ></textarea>
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Question'}
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default QuestionForm;

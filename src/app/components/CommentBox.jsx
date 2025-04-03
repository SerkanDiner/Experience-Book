'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CommentBox({ postId }) {
  const { user } = useUser();
  const router = useRouter();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ Fetch Comments on Mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?postId=${postId}`);
        const data = await res.json();
        setComments(data || []);
      } catch (error) {
        console.error('❌ Failed to load comments:', error);
        setComments([]);
      }
    };

    fetchComments();
  }, [postId]);

  // ✅ Submit New Comment
  const handleSubmit = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!comment.trim()) {
      setMessage('Please write a comment.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: comment }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]); // add to top
      setComment('');
      setMessage('✅ Comment posted!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-md">
      {/* ✏️ Comment Form */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm resize-none h-24"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
      {message && (
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{message}</p>
      )}

      {/* 💬 List of Comments */}
      <div className="mt-6 space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500 italic">No comments yet.</p>
        )}

        {comments.map((c, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-sm"
          >
            {c.content}
          </div>
        ))}
      </div>
    </div>
  );
}

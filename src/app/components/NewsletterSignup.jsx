'use client';

import { useState } from 'react';
import {
  SendHorizonal,
  Mail,
  MessageSquareQuote,
  User,
  Star,
} from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [category, setCategory] = useState('other');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar, feedback, category, rating }),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setEmail('');
        setName('');
        setAvatar('');
        setFeedback('');
        setCategory('other');
        setRating(0);
        setError('');
      } else {
        setError(result.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Newsletter submission error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="bg-orange-50 dark:bg-gray-900 py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-4 text-orange-500">
          <Mail className="w-6 h-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Join Our Community
          </h2>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
          Share your thoughts! We’ll never display your email — just your name/avatar (optional) and testimonial if approved.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Email & Name */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  autoCapitalize="words"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
              </div>
            </div>

            {/* Avatar */}
            <div className="relative">
              <input
                type="url"
                placeholder="Avatar image URL (optional)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
            </div>

            {/* Category & Rating */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="praise">Praise</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating (1–5 stars)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating || ''}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Feedback */}
            <div className="relative">
              <textarea
                rows="4"
                required
                placeholder="Your feedback or testimonial"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <MessageSquareQuote className="absolute left-3 top-4 w-5 h-5 text-orange-400" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              <SendHorizonal className="w-5 h-5" />
              Submit Feedback
            </button>

            {error && (
              <p className="text-red-600 dark:text-red-400 font-medium mt-2">{error}</p>
            )}
          </form>
        ) : (
          <div className="text-center mt-6">
            <p className="text-green-600 dark:text-green-400 font-medium text-base">
              🎉 Thank you for your feedback! We may feature it after review.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

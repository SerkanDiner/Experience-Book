'use client';

import { useState } from 'react';
import { SendHorizonal, Mail, MessageSquareQuote } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, feedback }),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setEmail('');
        setFeedback('');
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
    <section className="bg-orange-50 dark:bg-orange-900 py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* ✨ Icon + Title */}
        <div className="flex items-center justify-center gap-2 mb-4 text-orange-500">
          <Mail className="w-6 h-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Join Our Community
          </h2>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-6">
          Be the first to hear about updates, events, and inspiration. Share your ideas to help us grow!
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
            </div>

            <div className="relative">
              <textarea
                rows="3"
                placeholder="Any feedback or suggestions? (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <MessageSquareQuote className="absolute left-3 top-4 w-5 h-5 text-orange-400" />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              <SendHorizonal className="w-5 h-5" />
              Subscribe
            </button>

            {error && (
              <p className="text-red-600 dark:text-red-400 font-medium mt-2">{error}</p>
            )}
          </form>
        ) : (
          <p className="text-green-600 dark:text-green-400 font-medium mt-4">
            🎉 Thank you for joining! We'll keep you posted.
          </p>
        )}
      </div>
    </section>
  );
}

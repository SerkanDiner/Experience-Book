'use client';

import { useState } from 'react';
import { Briefcase, Globe, Euro } from 'lucide-react';

export default function JobReviewForm({ onSubmitComplete }) {
  const [form, setForm] = useState({
    jobTitle: '',
    country: '',
    monthlySalary: '',
    recommended: 'yes',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError('');

    const cleanTitle = form.jobTitle.trim().toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    const cleanCountry = form.country.trim().toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    const salary = Number(form.monthlySalary);

    if (cleanTitle.length < 2 || cleanCountry.length < 2 || salary <= 0) {
      setError('Please enter valid and complete information.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/jobReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: cleanTitle,
          country: cleanCountry,
          monthlySalary: salary,
          recommended: form.recommended === 'yes',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      setSuccess(true);
      setForm({ jobTitle: '', country: '', monthlySalary: '', recommended: 'yes' });

      // ✅ Pass the full new review to the parent component
      if (onSubmitComplete && data.review) {
        onSubmitComplete(data.review);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-orange-500" />
        Submit a Job Review
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Help the community by sharing your job experience. No account required.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-orange-400" /> Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" /> Country
          </label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="e.g. Germany"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Euro className="w-4 h-4 text-orange-400" /> Monthly Salary (€ or local)
          </label>
          <input
            type="number"
            name="monthlySalary"
            value={form.monthlySalary}
            onChange={handleChange}
            placeholder="e.g. 3000"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Would you recommend this job?
          </label>
          <select
            name="recommended"
            value={form.recommended}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
          >
            <option value="yes">👍 Yes</option>
            <option value="no">👎 No</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded w-full transition"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {success && <p className="text-green-600 mt-4 text-sm">✅ Review submitted successfully!</p>}
      {error && <p className="text-red-600 mt-4 text-sm">❌ {error}</p>}
    </div>
  );
}

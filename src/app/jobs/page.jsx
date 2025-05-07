'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayCount, setDisplayCount] = useState(12);
  const [locationFilter, setLocationFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('process.env.JOB_API_URL', {
          cache: 'no-store',
        });
        const result = await res.json();
        const data = Array.isArray(result.data) ? result.data.slice(0, 100) : [];
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const updated = jobs.filter((job) => {
      const matchesRemote = remoteOnly ? job.remote : true;
      const matchesLocation = locationFilter ? job.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
      const matchesTag = tagFilter ? job.tags?.includes(tagFilter) : true;
      return matchesRemote && matchesLocation && matchesTag;
    });
    setFilteredJobs(updated);
    setDisplayCount(12); // reset count on filter change
  }, [jobs, remoteOnly, locationFilter, tagFilter]);

  const uniqueTags = [...new Set(jobs.flatMap((job) => job.tags || []))];
  const uniqueLocations = [...new Set(jobs.map((job) => job.location).filter(Boolean))];

  const visibleJobs = filteredJobs.slice(0, displayCount);
  const canShowMore = displayCount < filteredJobs.length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 🔶 Header */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-orange-500 mb-2">Tech & Remote Job Listings</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
          Discover 100+ real job openings pulled from Arbeitnow — filter, explore, and apply with ease.
        </p>
      </section>

      {/* 🎛 Filters */}
      <section className="mb-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <label className="text-sm font-semibold block mb-1 text-gray-700 dark:text-gray-300">Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
          >
            <option value="">All</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1 text-gray-700 dark:text-gray-300">Category</label>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
          >
            <option value="">All</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={() => setRemoteOnly(!remoteOnly)}
            className="h-4 w-4 text-orange-500"
          />
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Remote Only</label>
        </div>
      </section>

      {/* 📄 Jobs */}
      {visibleJobs.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No jobs match your filters.</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleJobs.map((job) => (
              <li
                key={job.slug}
                className="bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5"
              >
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block space-y-2"
                >
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.company_name}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.remote && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">Remote</span>
                    )}
                    {job.location && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">{job.location}</span>
                    )}
                    {job.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {job.created_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Posted {formatDistanceToNow(new Date(job.created_at * 1000), { addSuffix: true })}
                    </p>
                  )}
                </a>

                <div className="mt-4">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition"
                  >
                    View & Apply
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {/* 🔽 Show More */}
          {canShowMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setDisplayCount(displayCount + 12)}
                className="text-orange-500 text-sm hover:underline"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

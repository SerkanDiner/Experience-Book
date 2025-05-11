'use client';

import { useEffect, useState } from 'react';
import PostCard from '../components/postComponents/PostCard';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 100 }),
        });

        const data = await res.json();
        setAllPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
      } catch (error) {
        console.error('❌ Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter((post) =>
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
      setFilteredPosts(filtered);
    }
  }, [query, allPosts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 🎯 Intro & Search Hero */}
      <section className="text-center mb-14">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">Explore Real Career Stories</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 text-sm sm:text-base">
          Search through firsthand experiences shared by people across various industries, jobs, and countries.
          Discover salaries, recommendations, and personal journeys that help you plan your own path.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search career stories..."
            className="w-full sm:w-[400px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-1"
          >
            <SearchIcon className="w-4 h-4" />
            Search
          </button>
        </form>
      </section>

      {/* 🧠 Content Section */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading stories...</p>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-20">
          <p className="text-lg">No experiences match your search.</p>
          <p className="text-sm mt-2">Try a different keyword like "teacher", "developer", or "Germany".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Select } from 'flowbite-react';
import PostCard from '../components/postComponents/PostCard';
import { Search as SearchIcon, Briefcase, Lightbulb } from 'lucide-react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allCategories, setAllCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false); // ✅ Filter toggle state

  const sidebarData = useMemo(() => ({
    searchTerm: searchParams.get('searchTerm') || '',
    sort: searchParams.get('sort') || 'desc',
    category: searchParams.get('category') || '',
  }), [searchParams]);

  useEffect(() => {
    fetch('/api/post/categories')
      .then(res => res.json())
      .then(data => setAllCategories(data.categories || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const body = {
      limit: 9,
      order: sidebarData.sort,
      searchTerm: sidebarData.searchTerm,
    };
    if (sidebarData.category) body.categories = [sidebarData.category];

    fetch('/api/post/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setShowMore((data.posts || []).length === 9);
      })
      .finally(() => setLoading(false));
  }, [sidebarData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const params = new URLSearchParams(searchParams);
    value === '' ? params.delete(id) : params.set(id, value);
    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => router.push('/search');

  const handleShowMore = async () => {
    const res = await fetch('/api/post/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 9,
        order: sidebarData.sort,
        categories: sidebarData.category ? [sidebarData.category] : [],
        searchTerm: sidebarData.searchTerm,
        startIndex: posts.length,
      }),
    });
    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 🧡 Intro Section */}
      <section className="mb-10 text-center">
        <div className="flex justify-center items-center gap-3 text-orange-500 mb-2">
          <SearchIcon className="w-6 h-6" />
          <h1 className="text-3xl sm:text-4xl font-bold">Explore Real Career Experiences</h1>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Browse shared stories from professionals across industries. Filter by category, sort by time,
          and find insights that inspire your next step.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-6 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Briefcase className="w-5 h-5 text-orange-400" />
            Career Insights
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Lightbulb className="w-5 h-5 text-orange-400" />
            Real Stories
          </div>
        </div>
      </section>

      {/* 🔘 Show/Hide Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <Button
            size="sm"
            className="text-orange-500 border border-orange-400 bg-white hover:bg-orange-500 hover:text-white"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>

          <Button
            size="sm"
            className="text-orange-500 border border-orange-400 bg-white hover:bg-orange-500 hover:text-white"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* 🧠 Animated Filter Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          filterOpen ? 'max-h-screen mb-8' : 'max-h-0 mb-0'
        }`}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort by:
            </label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category:
            </label>
            <Select id="category" value={sidebarData.category} onChange={handleChange}>
              <option value="">All Profiles</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
        </form>
      </div>

      {/* 📄 Post Grid */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">Loading...</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500 dark:text-gray-400">No matching experiences found.</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Try adjusting your filters or search term.</p>
          <a
            href="/share"
            className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Share Your Experience
          </a>
        </div>
      )}

      {/* ⏬ Show More */}
      {showMore && (
        <div className="text-center mt-12">
          <button
            onClick={handleShowMore}
            className="text-orange-500 text-sm hover:underline"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

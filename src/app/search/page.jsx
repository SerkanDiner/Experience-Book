'use client';

import { Button, Select } from 'flowbite-react';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '../components/PostCard';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allCategories, setAllCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const sidebarData = useMemo(() => ({
    searchTerm: searchParams.get('searchTerm') || '',
    sort: searchParams.get('sort') || 'desc',
    category: searchParams.get('category') || ''
  }), [searchParams]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/post/categories', { cache: 'force-cache' });
        const data = await res.json();
        if (res.ok && isMounted) setAllCategories(data.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const body = {
        limit: 9,
        order: sidebarData.sort,
        searchTerm: sidebarData.searchTerm,
      };
      if (sidebarData.category) {
        body.categories = [sidebarData.category];
      }

      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sidebarData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const params = new URLSearchParams(searchParams);
    value === '' ? params.delete(id) : params.set(id, value);
    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => router.push('/search');

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const res = await fetch('/api/post/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 9,
        order: sidebarData.sort,
        categories: sidebarData.category ? [sidebarData.category] : [],
        searchTerm: sidebarData.searchTerm,
        startIndex,
      }),
    });
    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className='flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 min-h-screen relative'>

      {/* ✅ Mobile: Show / Reset Filter Buttons */}
      <div className='md:hidden px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex flex-col gap-2 z-10'>
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            className="w-1/2 text-orange-500 border border-orange-400 bg-white hover:bg-orange-500 hover:text-white"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            size="sm"
            className="w-1/2 text-orange-500 border border-orange-400 bg-white hover:bg-orange-500 hover:text-white"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ✅ Mobile Filter Overlay (absolute) */}
      {mobileFilterOpen && (
        <aside className='md:hidden absolute top-[90px] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 z-40 p-4 shadow-md'>
          <form className='flex flex-col gap-4' onSubmit={(e) => e.preventDefault()}>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-200'>Sort by:</label>
              <Select onChange={handleChange} id='sort' value={sidebarData.sort}>
                <option value='desc'>Latest</option>
                <option value='asc'>Oldest</option>
              </Select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-200'>Category:</label>
              <Select onChange={handleChange} id='category' value={sidebarData.category}>
                <option value=''>All Profiles</option>
                {allCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>
          </form>
        </aside>
      )}

      {/* ✅ Desktop Sidebar + Reset Filter Button */}
      <aside className='hidden md:flex md:flex-col gap-4 p-5 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 w-[260px]'>
        <form className='flex flex-col gap-4' onSubmit={(e) => e.preventDefault()}>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-200'>Sort by:</label>
            <Select onChange={handleChange} id='sort' value={sidebarData.sort}>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-200'>Category:</label>
            <Select onChange={handleChange} id='category' value={sidebarData.category}>
              <option value=''>All Profiles</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
        </form>

        {/* ✅ Reset Button for Desktop */}
        <Button
          size="sm"
          onClick={handleReset}
          className="w-full mt-2 text-orange-500 border border-orange-400 bg-white hover:bg-orange-500 hover:text-white"
        >
          Reset Filters
        </Button>
      </aside>

      {/* ✅ Main Content Area */}
      <main className='w-full md:flex-1'>
        <h1 className='text-3xl font-semibold border-b border-gray-300 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white'>
          All Experiences
        </h1>

        <div className='p-6 flex flex-wrap gap-6 bg-gray-50 dark:bg-gray-900'>
          {loading && <p className='text-lg text-gray-500 dark:text-gray-400'>Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className='text-lg text-gray-500 dark:text-gray-400'>No posts found.</p>
          )}
          {!loading && posts.map((post) => <PostCard key={post._id} post={post} />)}

          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-4 w-full text-center'
            >
              Show More
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

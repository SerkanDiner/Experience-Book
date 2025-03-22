'use client';

import { Button, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: '',
  });

  const [allCategories, setAllCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/post/categories');
        const data = await res.json();
        if (res.ok) {
          setAllCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category');

    setSidebarData((prev) => ({
      ...prev,
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl ?? '',
    }));

    const fetchPosts = async () => {
      setLoading(true);
      const requestBody = {
        limit: 9,
        order: sortFromUrl,
        searchTerm: searchTermFromUrl,
      };

      if (categoryFromUrl && categoryFromUrl !== '') {
        requestBody.categories = [categoryFromUrl];
      }

      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({
      ...prev,
      [id]: id === 'category' ? (value === '' ? '' : value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebarData.searchTerm.trim() !== '') {
      urlParams.set('searchTerm', sidebarData.searchTerm.trim());
    }
    urlParams.set('sort', sidebarData.sort);
    if (sidebarData.category && sidebarData.category !== '') {
      urlParams.set('category', sidebarData.category);
    }
    router.push(`/search?${urlParams.toString()}`);
    setSidebarData((prev) => ({ ...prev, searchTerm: '' }));
  };

  const handleReset = () => {
    setSidebarData({ searchTerm: '', sort: 'desc', category: '' });
    router.push('/search');
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('startIndex', startIndex);
    const res = await fetch('/api/post/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 9,
        order: sidebarData.sort,
        categories: [sidebarData.category],
        searchTerm: sidebarData.searchTerm,
        startIndex,
      }),
    });

    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className='flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 min-h-screen'>
      <div className='p-6 border-b md:border-r md:min-h-screen border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 w-full md:w-1/4'>
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-gray-700 dark:text-gray-200'>Sort by:</label>
            <Select onChange={handleChange} id='sort' value={sidebarData.sort}>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-semibold text-gray-700 dark:text-gray-200'>Category:</label>
            <Select onChange={handleChange} id='category' value={sidebarData.category}>
              <option value=''>All Profiles</option>
              {allCategories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>

          <div className='flex gap-4 mt-2'>
            <Button type='submit' gradientDuoTone='purpleToPink' className='w-1/2'>
              Apply
            </Button>
            <Button type='button' gradientDuoTone='purpleToPink' onClick={handleReset} className='w-1/2'>
              Reset
            </Button>
          </div>
        </form>
      </div>

      <div className='w-full md:w-3/4'>
        <h1 className='text-3xl font-semibold border-b border-gray-300 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white'>
          Experience results:
        </h1>
        <div className='p-6 flex flex-wrap gap-6 bg-gray-50 dark:bg-gray-900'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500 dark:text-gray-400'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500 dark:text-gray-400'>Loading...</p>}
          {!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-4 w-full text-center'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '../components/PostCard';
export default function Profiles() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    categories: 'uncategorized',
  });

  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm') || ''; 
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('categories'); // Can be null or ''
  
    setSidebarData((prev) => ({
      ...prev,
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl ?? '', // ✅ If missing, default to All Profiles
    }));
  
    const fetchPosts = async () => {
      setLoading(true);
      
      const requestBody = {
        limit: 9,
        order: sortFromUrl,
        searchTerm: searchTermFromUrl,
      };
  
      // ✅ Only include category if a specific one is chosen
      if (categoryFromUrl && categoryFromUrl !== '') {
        requestBody.category = categoryFromUrl;
      }
  
      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
  
        if (!res.ok) throw new Error('Failed to fetch posts');
  
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
  
    // ✅ Add search term to URL, but do not keep it in the input field
    if (sidebarData.searchTerm.trim() !== '') {
      urlParams.set('searchTerm', sidebarData.searchTerm.trim());
    }
  
    urlParams.set('sort', sidebarData.sort);
  
    // ✅ Only set category if the user has selected one
    if (sidebarData.category && sidebarData.category !== '') {
      urlParams.set('category', sidebarData.category);
    }
  
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  
    // ✅ Clear search term from input field
    setSidebarData((prev) => ({
      ...prev,
      searchTerm: '',
    }));
  };
  
  
  const handleReset = () => {
    // Reset all filters
    setSidebarData({
      searchTerm: '',
      sort: 'desc',
      category: '',
    });
  
    // Redirect to default search page (no filters)
    router.push('/search');
  };
  
  
  
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch('/api/post/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        limit: 9,
        order: sidebarData.sort,
        category: sidebarData.category,
        searchTerm: sidebarData.searchTerm,
        startIndex,
      }),
    });
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select onChange={handleChange} id='category'>
             <option value=''>All Profiles</option> {''}
              <option value='uncategorized'>Uncategorized</option>
              <option value='informationTechnology'>Information Technology </option>
              <option value='lawEnforcement'>Law Enforcement</option>
              <option value='engineering'>Engineering</option>
              <option value='finance'>Finance and Banking</option>
              <option value='healtcare'>Healthcare</option>
              <option value='education'>Education and Teaching</option>
              <option value='aviation'>Aviation and Aerospace</option>
              <option value='entrepreneur'>Entrepreneurship</option>
              <option value='media'>Creative and Media Industury</option>
              <option value='sports'>Sports and Fitness</option>
            </Select>
          </div>
    <div className="flex gap-4">
    <Button type='submit' outline gradientDuoTone='purpleToPink'>
      Apply Filters
    </Button>
    <Button type='button' outline gradientDuoTone='purpleToPink' onClick={handleReset}>
      Reset Filters
    </Button>
     </div>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Experience results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
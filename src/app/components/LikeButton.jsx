'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function LikeButton({ postId }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch latest likes count on load
  useEffect(() => {
    const fetchLikes = async () => {
      const res = await fetch(`/api/post/like?postId=${postId}`);
      const data = await res.json();
      setLikes(data.likes || 0);
    };
  
    fetchLikes();
  
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    if (likedPosts.includes(postId)) {
      setLiked(true);
    }
  }, [postId]);
  

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    const newLiked = !liked;
    const method = newLiked ? 'like' : 'unlike';

    try {
      const res = await fetch('/api/post/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, method }),
      });
      const data = await res.json();

      if (res.ok) {
        setLikes(data.likes || 0);
        setLiked(newLiked);

        // Update localStorage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        const updated = newLiked
          ? [...new Set([...likedPosts, postId])]
          : likedPosts.filter((id) => id !== postId);
        localStorage.setItem('likedPosts', JSON.stringify(updated));
      } else {
        console.error(data.message || 'Like failed');
      }
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 text-sm transition ${
        liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      disabled={loading}
    >
      {liked ? <FaHeart /> : <FaRegHeart />}
      <span>{likes}</span>
    </button>
  );
}

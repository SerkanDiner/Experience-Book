'use client';

import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function LikeButton({ initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-red-500 text-sm hover:scale-105 transition"
    >
      {liked ? <FaHeart /> : <FaRegHeart />}
      <span>{likes}</span>
    </button>
  );
}

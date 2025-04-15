"use client";

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeCom({ children }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure hydration consistency
  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <p className="text-gray-500 dark:text-gray-400">Loading theme...</p>
    </div>
  );

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-900 min-h-screen transition-colors duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
}

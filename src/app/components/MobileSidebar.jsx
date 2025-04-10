'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaHome, FaInfoCircle, FaIndustry,FaVideo,FaThList } from 'react-icons/fa';
import { TextInput, Button } from 'flowbite-react';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

const navLinks = [
  { href: '/', label: 'Home', icon: <FaHome /> },
  { href: '/about', label: 'About', icon: <FaInfoCircle /> },
  { href: '/search', label: 'Experiences', icon: <FaThList /> },
  { href: '/industries', label: 'Industries', icon: <FaIndustry /> },
  { href: '/videos', label: 'Videos', icon: <FaVideo /> },
];

export default function MobileSidebar({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40">
      <div className="absolute top-0 left-0 h-full w-[80%] max-w-xs bg-white dark:bg-gray-900 shadow-2xl rounded-r-2xl p-6 flex flex-col">
        {/* ✖ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-orange-500 transition"
        >
          ×
        </button>

        {/* 🔹 Navigation */}
        <nav className="mt-12 flex flex-col gap-3">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                pathname === href
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* 🔍 Search + 🌗 Toggle */}
        <div className="mt-8 flex items-center gap-2">
          <TextInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            rightIcon={AiOutlineSearch}
            className="flex-grow"
          />
          <Button
            type="button"
            className="w-10 h-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
          </Button>
        </div>

        {/* 👤 Auth Actions */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
          <SignedIn>
            <SignOutButton>
              <Button color="gray" className="w-full" onClick={onClose}>
                Sign out
              </Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" onClick={onClose}>
              <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white">
                Sign in
              </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}

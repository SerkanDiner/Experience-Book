'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaHome, FaInfoCircle, FaThList, FaIndustry } from 'react-icons/fa';
import { TextInput, Button } from 'flowbite-react';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

// ✅ Corrected navLinks: now Industries points to "/industries"
const navLinks = [
  { href: '/', label: 'Home', icon: <FaHome /> },
  { href: '/about', label: 'About', icon: <FaInfoCircle /> },
  { href: '/search', label: 'Experiences', icon: <FaThList /> },
  { href: '/industries', label: 'Industries', icon: <FaIndustry /> },
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
      <div className="absolute top-0 left-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-900 shadow-xl p-6 rounded-r-2xl">
        {/* ✖ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-orange-500"
        >
          ×
        </button>

        {/* 🧭 Navigation */}
        <nav className="flex flex-col gap-2 mt-2">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${
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

        {/* 🔍 Search + Toggle (side by side) */}
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <TextInput
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              rightIcon={AiOutlineSearch}
              className="flex-grow"
            />
            <Button
              type="button"
              className="w-10 h-10 rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? (
                <FaSun className="text-yellow-500" />
              ) : (
                <FaMoon className="text-blue-400" />
              )}
            </Button>
          </form>
        </div>

        {/* 👤 Auth Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <SignedIn>
            <SignOutButton>
              <Button color="gray" onClick={onClose}>
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

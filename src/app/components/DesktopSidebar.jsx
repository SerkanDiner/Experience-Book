'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { Button } from 'flowbite-react';
import { 
  FaHome, 
  FaInfoCircle, 
  FaThList, 
  FaUsers, 
  FaBuilding, 
  FaVideo, 
  FaBriefcase,FaSun 
} from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Home', icon: <FaHome /> },
  { href: '/about', label: 'About', icon: <FaInfoCircle /> },
  { href: '/post', label: 'Experiences', icon: <FaThList /> },
  { href: '/profile', label: 'Users', icon: <FaUsers /> },        // 👥 Makes more sense for user profiles
  { href: '/industry', label: 'Industries', icon: <FaBuilding /> },
  { href: '/videos', label: 'Videos', icon: <FaVideo /> },
  { href: '/jobs', label: 'Jobs', icon: <FaBriefcase /> },        // 💼 Better than FaVideo for job listings
];

export default function DesktopSidebar({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="px-6 py-6 flex flex-col gap-4">
        {/* 🔗 Nav Links */}
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-semibold transition ${
                pathname === href
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>

        {/* 🌙 Toggle + Auth */}
        <div className="flex items-center justify-between mt-6 gap-2">
          <Button
            className="w-10 h-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
          </Button>

          <SignedIn>
            <SignOutButton>
              <Button color="gray" className="w-full">
                Sign out
              </Button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in">
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

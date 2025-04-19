'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { TextInput } from 'flowbite-react';
import MobileSidebar from '@/app/components/MobileSidebar';
import DesktopSidebar from '@/app/components/DesktopSidebar';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const AiOutlineSearch = dynamic(() => import('react-icons/ai').then(mod => mod.AiOutlineSearch));
const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), { ssr: false });
const SignedIn = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedIn), { ssr: false });
const SignedOut = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedOut), { ssr: false });

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);

  useEffect(() => {
    const termFromUrl = searchParams.get('searchTerm');
    if (termFromUrl) setSearchTerm(termFromUrl);
  }, [searchParams]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(searchParams);
      urlParams.set('searchTerm', searchTerm.trim());
      router.push(`/search?${urlParams.toString()}`);
      setIsMenuOpen(false);
    },
    [searchTerm, router, searchParams]
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b-2 px-4 py-2 lg:px-8 shadow-sm">
        <div className="flex items-center justify-between lg:justify-center gap-4 w-full">
          {/* 🍔 Mobile Burger Icon */}
          <button
            className="flex lg:hidden w-10 h-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Toggle Mobile Sidebar"
          >
            {isMenuOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
          </button>

          {/* 🍔 Desktop Burger Icon */}
          <button
              className="hidden lg:flex w-10 h-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              onClick={() => setIsDesktopSidebarOpen(prev => !prev)}
              aria-label="Toggle Desktop Sidebar"
            >
              <AnimatePresence mode="wait">
                {isDesktopSidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiX size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiMenuAlt3 size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

          {/* 🔶 Centered Logo + Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-4 w-full max-w-4xl">
            <Link href="/" className="text-2xl font-bold dark:text-white text-center lg:text-left">
              <span className="text-orange-400">Experience Book</span>
            </Link>

            <form onSubmit={handleSubmit} className="w-full max-w-sm hidden lg:block">
              <TextInput
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                rightIcon={AiOutlineSearch}
                className="w-full rounded-md"
              />
            </form>
          </div>

          {/* 👤 Avatar or Sign In */}
          <div className="flex items-center gap-2 lg:absolute right-6">
            <SignedIn>
              <UserButton userProfileUrl="/dashboard?tab=profile" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-up">
                <button
                  className="bg-orange-400 hover:bg-orange-500 text-white text-xs font-medium px-3 py-[6px] rounded-md shadow-sm h-8 flex items-center justify-center transition duration-200"
                >
                  Sign up
                </button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* ✅ Desktop Sidebar */}
      <DesktopSidebar isOpen={isDesktopSidebarOpen} onClose={() => setIsDesktopSidebarOpen(false)} />

      {/* ✅ Mobile Sidebar */}
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

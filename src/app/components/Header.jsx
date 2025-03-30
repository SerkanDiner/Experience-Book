'use client';

import { Button, Navbar, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { SignedIn, SignedOut, UserButton, SignOutButton } from '@clerk/nextjs';
import { dark, light } from '@clerk/themes';
import { useEffect, useState, useCallback, useRef } from 'react';

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const searchRef = useRef();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/search', label: 'Experiences' },
  ];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(searchParams);
      urlParams.set('searchTerm', searchTerm.trim());
      router.push(`/search?${urlParams.toString()}`);
      setIsMenuOpen(false);
      setShowSearchPopup(false);
    },
    [searchTerm, router, searchParams]
  );

  useEffect(() => {
    const termFromUrl = searchParams.get('searchTerm');
    if (termFromUrl) setSearchTerm(termFromUrl);
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchPopup(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderNavLinks = (isMobile = false) =>
    navLinks.map(({ href, label }) => {
      const isActive = path === href;
      const baseClasses = 'font-semibold transition duration-200';
      const activeClasses = isMobile
        ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10'
        : 'text-orange-400 underline';
      const inactiveClasses = isMobile
        ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        : 'text-gray-700 dark:text-white hover:text-orange-500';

      return (
        <Link
          key={href}
          href={href}
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={`${baseClasses} ${
            isActive ? activeClasses : inactiveClasses
          } ${isMobile ? 'py-2 px-4 rounded-md w-full text-base' : ''}`}
        >
          {label}
        </Link>
      );
    });

  return (
    <Navbar className="sticky top-0 z-50 border-b-2 bg-white bg-opacity-90 dark:bg-gray-900 backdrop-blur-md px-4 py-2 lg:px-8 shadow-sm">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* ✅ Mobile Top Row: Logo - Avatar - Burger */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <Link
            href="/"
            className="text-lg sm:text-xl font-semibold whitespace-nowrap dark:text-white"
          >
            <span className="text-orange-400">Experience Book</span>
          </Link>

          <SignedIn>
            <div className="flex-1 flex justify-center">
              <UserButton
                appearance={{ baseTheme: theme === 'light' ? light : dark }}
                userProfileUrl="/dashboard?tab=profile"
              />
            </div>
          </SignedIn>

          <Button
            className="w-10 h-10"
            color="gray"
            pill
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? '✖' : '☰'}
          </Button>
        </div>

        {/* ✅ Desktop Logo */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link
            href="/"
            className="text-lg sm:text-xl font-semibold whitespace-nowrap dark:text-white"
          >
            <span className="text-orange-400">Experience Book</span>
          </Link>
        </div>

        {/* 🔍 Desktop Search Icon + Popup */}
        <div className="hidden lg:flex items-center gap-2 relative" ref={searchRef}>
          <Button
            className="w-10 h-10 rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
            onClick={() => setShowSearchPopup((prev) => !prev)}
            aria-label="Open search"
          >
            <AiOutlineSearch className="text-xl" />
          </Button>

          {showSearchPopup && (
            <form
              onSubmit={handleSubmit}
              className="absolute top-12 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-xl border p-3 w-[300px]"
            >
              <TextInput
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                rightIcon={AiOutlineSearch}
                className="w-full rounded-md"
              />
            </form>
          )}
        </div>

        {/* 🧭 Desktop Nav + Auth */}
        <div className="hidden lg:flex items-center justify-end gap-4 w-full lg:w-1/3">
          {renderNavLinks()}

          <Button
            className="w-10 h-10 rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FaSun className="text-yellow-500" />
            ) : (
              <FaMoon className="text-blue-400" />
            )}
          </Button>

          <SignedIn>
            <UserButton
              appearance={{ baseTheme: theme === 'light' ? light : dark }}
              userProfileUrl="/dashboard?tab=profile"
            />
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in">
              <Button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 text-sm font-semibold rounded-md shadow-sm transition">
                Sign in
              </Button>
            </Link>
          </SignedOut>
        </div>

        {/* 📱 Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 z-50 w-full border-t bg-white dark:bg-gray-900 px-6 py-6 shadow-lg">
            <form onSubmit={handleSubmit} className="w-full mb-4">
              <TextInput
                type="text"
                placeholder="Search..."
                rightIcon={AiOutlineSearch}
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <div className="flex justify-center mb-4">
              <Button
                className="w-10 h-10 rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <FaSun className="text-yellow-500" />
                ) : (
                  <FaMoon className="text-blue-400" />
                )}
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
              {renderNavLinks(true)}

              <SignedIn>
                <SignOutButton>
                  <Button color="gray" onClick={() => setIsMenuOpen(false)}>
                    Sign out
                  </Button>
                </SignOutButton>
              </SignedIn>

              <SignedOut>
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 text-sm font-semibold rounded-md shadow-sm transition">
                    Sign in
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </Navbar>
  );
}

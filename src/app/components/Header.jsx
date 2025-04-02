'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Button, TextInput } from 'flowbite-react';

// Lazy-loaded icons
const AiOutlineSearch = dynamic(() => import('react-icons/ai').then(mod => mod.AiOutlineSearch));
const FaSun = dynamic(() => import('react-icons/fa').then(mod => mod.FaSun));
const FaMoon = dynamic(() => import('react-icons/fa').then(mod => mod.FaMoon));

// Lazy-loaded Clerk components
const UserButton = dynamic(() =>
  import('@clerk/nextjs').then(mod => mod.UserButton),
  { ssr: false }
);

const SignOutButton = dynamic(() =>
  import('@clerk/nextjs').then(mod => mod.SignOutButton),
  { ssr: false }
);

const SignedIn = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedIn), { ssr: false });
const SignedOut = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedOut), { ssr: false });
const dark = dynamic(() => import('@clerk/themes').then(mod => mod.dark), { ssr: false });
const light = dynamic(() => import('@clerk/themes').then(mod => mod.light), { ssr: false });

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/search', label: 'Experiences' },
  ];

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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderNavLinks = (isMobile = false) =>
    navLinks.map(({ href, label }) => {
      const isActive = path === href;
      const base = 'font-semibold transition duration-200';
      const active = isMobile
        ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10'
        : 'text-orange-400 underline';
      const inactive = isMobile
        ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        : 'text-gray-700 dark:text-white hover:text-orange-500';

      return (
        <Link
          key={href}
          href={href}
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={`${base} ${isActive ? active : inactive} ${
            isMobile ? 'py-2 px-4 rounded-md w-full text-base' : ''
          }`}
        >
          {label}
        </Link>
      );
    });

  return (
    <div className="sticky top-0 z-50 border-b-2 bg-white bg-opacity-90 dark:bg-gray-900 backdrop-blur-md px-4 py-2 lg:px-8 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">

        {/* 🔷 Mobile Top Row */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <Link href="/" className="text-xl font-semibold dark:text-white">
            <span className="text-orange-400">Experience Book</span>
          </Link>

          <SignedIn>
            <UserButton userProfileUrl="/dashboard?tab=profile" />
          </SignedIn>

          <Button
            className="w-10 h-10"
            color="gray"
            pill
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(prev => !prev)}
          >
            {isMenuOpen ? '✖' : '☰'}
          </Button>
        </div>

        {/* 🔷 Desktop Top Row */}
        <div className="hidden lg:flex justify-between items-center w-full">
          <Link href="/" className="text-xl font-semibold dark:text-white">
            <span className="text-orange-400">Experience Book</span>
          </Link>

          <div className="flex items-center gap-4">
            {renderNavLinks()}

            <Button
              className="w-10 h-10 rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
            </Button>

            <SignedIn>
              <UserButton userProfileUrl="/dashboard?tab=profile" />
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1.5 text-sm font-semibold rounded-md shadow-sm transition">
                  Sign in
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>

        {/* 🔷 Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 z-50 w-full border-t bg-white dark:bg-gray-900 px-6 py-6 shadow-lg">
            <form onSubmit={handleSubmit} className="w-full mb-4">
              <TextInput
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                rightIcon={AiOutlineSearch}
              />
            </form>

            <div className="flex justify-center mb-4">
              <Button
                className="w-10 h-10 rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
                onClick={toggleTheme}
              >
                {theme === 'light' ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-400" />}
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
    </div>
  );
}

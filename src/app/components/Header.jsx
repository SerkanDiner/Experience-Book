'use client';

import { Button, Navbar, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { SignedIn, SignedOut, UserButton, SignOutButton } from '@clerk/nextjs';
import { dark, light } from '@clerk/themes';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
    setIsMenuOpen(false); // Close menu after search
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);

  return (
    <Navbar className="sticky top-0 border-b-2 px-4 py-2 lg:px-8 shadow-sm z-50 bg-white dark:bg-gray-900 backdrop-blur-md bg-opacity-90">
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* ✅ Top Row (Logo + Burger) */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link href='/' className="text-lg sm:text-xl font-semibold dark:text-white whitespace-nowrap">
            <span className="text-orange-400">Experience Book</span>
          </Link>

          <Button
            className="w-10 h-10 lg:hidden"
            color="gray"
            pill
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </Button>
        </div>

        {/* ✅ Desktop Search (centered) */}
        <div className="hidden lg:flex w-full lg:flex-1 justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <TextInput
              type="text"
              placeholder="Search..."
              rightIcon={AiOutlineSearch}
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* ✅ Desktop Right Side */}
        <div className="hidden lg:flex gap-4 items-center justify-end w-full lg:w-1/3">
          {['/', '/about', '/search'].map((href, i) => {
            const titles = ['Home', 'About', 'Experiences'];
            return (
              <Link
                key={href}
                href={href}
                className={`font-semibold transition hover:text-orange-500 ${
                  path === href ? 'text-orange-400 underline' : 'text-gray-700 dark:text-white'
                }`}
              >
                {titles[i]}
              </Link>
            );
          })}

          {/* 🌙 Theme Toggle (Desktop Only) */}
          <Button
            className="w-10 h-10 hidden lg:flex items-center justify-center"
            color="gray"
            pill
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </Button>

          {/* 👤 Auth (Desktop) */}
          <SignedIn>
            <UserButton
              appearance={{ baseTheme: theme === 'light' ? light : dark }}
              userProfileUrl="/dashboard?tab=profile"
            />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button className="bg-orange-400 text-white rounded-lg">
                Sign in
              </Button>
            </Link>
          </SignedOut>
        </div>

        {/* ✅ Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 z-50 shadow-lg border-t py-6 px-6 flex flex-col gap-4 text-center">

            {/* ✅ Mobile Search Box */}
            <form onSubmit={handleSubmit} className="w-full">
              <TextInput
                type="text"
                placeholder="Search..."
                rightIcon={AiOutlineSearch}
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {/* 🌙 Theme Toggle (Mobile Only) */}
            <Button
              className="w-10 h-10 mx-auto"
              color="gray"
              pill
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>

            {/* 📌 Nav Links */}
            {[{ href: '/', label: 'Home' }, { href: '/about', label: 'About' }, { href: '/search', label: 'Experiences' }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`w-full py-2 px-4 rounded-md font-semibold text-base transition ${
                  path === href
                    ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* 🔐 Mobile Auth */}
            <SignedIn>
              <div className="flex flex-col items-center gap-2 pt-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ baseTheme: theme === 'light' ? light : dark }}
                  userProfileUrl="/dashboard?tab=profile"
                />
                <SignOutButton>
                  <Button color="gray" onClick={() => setIsMenuOpen(false)}>
                    Sign out
                  </Button>
                </SignOutButton>
              </div>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                <Button gradientDuoTone="purpleToPink" className="w-full">
                  Sign in
                </Button>
              </Link>
            </SignedOut>
          </div>
        )}
      </div>
    </Navbar>
  );
}

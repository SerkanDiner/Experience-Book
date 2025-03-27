'use client';
import { Button, Navbar, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
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
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);

  return (
    <Navbar className="relative border-b-2 px-4 py-2 lg:px-8 shadow-sm z-50">
      {/* ✅ Desktop & Mobile Wrapper */}
      <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* ✅ Top Row (Logo + Mobile Burger) */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          {/* Logo */}
          <Link href='/' className="text-lg sm:text-xl font-semibold dark:text-white whitespace-nowrap">
            <span className="text-orange-400">Experience Book</span>
          </Link>

          {/* Mobile Burger */}
          <Button
            className="lg:hidden"
            color="gray"
            pill
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </Button>
        </div>

        {/* ✅ Search (Responsive) */}
        <div className="w-full lg:flex-1 flex justify-center lg:justify-center">
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

        {/* ✅ Right Side - Navigation + Actions (Desktop Only) */}
        <div className="hidden lg:flex gap-4 items-center justify-end w-full lg:w-1/3">
          {/* Nav Links */}
          <Link href="/" className={`font-semibold ${path === '/' ? 'text-orange-400 underline' : 'text-gray-700 dark:text-white'}`}>
            Home
          </Link>
          <Link href="/about" className={`font-semibold ${path === '/about' ? 'text-orange-400 underline' : 'text-gray-700 dark:text-white'}`}>
            About
          </Link>
          <Link href="/search" className={`font-semibold ${path === '/search' ? 'text-orange-400 underline' : 'text-gray-700 dark:text-white'}`}>
            Experiences
          </Link>

          {/* Theme Toggle */}
          <Button
            className="w-10 h-10"
            color="gray"
            pill
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </Button>

          {/* Auth */}
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

        {/* ✅ Mobile Menu (Absolute Overlay) */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 z-50 shadow-lg border-t py-4 flex flex-col items-center gap-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white font-semibold text-lg">
              Home
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white font-semibold text-lg">
              About
            </Link>
            <Link href="/search" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white font-semibold text-lg">
              Experiences
            </Link>

            {/* Theme Toggle (Mobile) */}
            <Button
              className="w-10 h-10"
              color="gray"
              pill
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>

            {/* Sign In (Mobile) */}
            <SignedOut>
              <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                <Button gradientDuoTone="purpleToPink">
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

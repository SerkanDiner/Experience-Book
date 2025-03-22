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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

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
    <Navbar className='border-b-2 flex justify-between items-center px-4 lg:px-8'>
      {/* ✅ Left Side (Logo) */}
      <div className="flex items-center gap-2 w-1/3">
        <Link href='/' className='whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
          <span className='px-2 py-1 bg-orange-400 rounded-lg text-white'>
            Experience Book
          </span>
        </Link>
      </div>

      {/* ✅ Middle (Search Box - Always Visible) */}
      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='w-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* ✅ Right Side (Navigation + User + Dark Mode + Burger Menu) */}
      <div className='flex gap-4 items-center w-1/3 justify-end'>
        {/* ✅ Desktop Navigation Links (Visible Only on Large Screens) */}
        <div className="hidden lg:flex gap-6">
          <Link href='/' className={`text-gray-700 dark:text-white font-semibold ${path === '/' ? 'underline' : ''}`}>
            Home
          </Link>
          <Link href='/about' className={`text-gray-700 dark:text-white font-semibold ${path === '/about' ? 'underline' : ''}`}>
            About
          </Link>
          <Link href='/search' className={`text-gray-700 dark:text-white font-semibold ${path === '/profiles' ? 'underline' : ''}`}>
            Experiences
          </Link>
        </div>

        {/* ✅ Dark Mode Toggle (Only Desktop) */}
        <Button
          className='w-12 h-10 hidden sm:inline' // ✅ Hidden on mobile
          color='gray'
          pill
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>

        {/* ✅ User Authentication (Only Desktop) */}
        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: theme === 'light' ? light : dark,
            }}
            userProfileUrl='/dashboard?tab=profile'
          />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <Button className='px-4 py-2 bg-orange-400 rounded-lg text-white hidden lg:inline'>
              Sign-in
            </Button>
          </Link>
        </SignedOut>

        {/* ✅ Mobile Burger Icon */}
        <Button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} color="gray" pill>
          {isMenuOpen ? "✖" : "☰"}
        </Button>
      </div>

      {/* ✅ Mobile Menu (Only Shown When isMenuOpen is True) */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 z-50 shadow-lg flex flex-col items-center space-y-4 py-4">
          {/* Navigation Links */}
          <Link href='/' onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white font-semibold text-lg">
            Home
          </Link>
          <Link href='/about' onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white font-semibold text-lg">
            About
          </Link>
          <Link href='/search' onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white font-semibold text-lg">
            Experiences
          </Link>
          {/* ✅ Dark Mode Toggle (Only in Mobile Menu) */}
          
            
            <Button
              className="w-12 h-10"
              color="gray"
              pill
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
          
          



          {/* ✅ Sign In (Only in Mobile Menu) */}
          <SignedOut>
            <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
              <Button  gradientDuoTone='purpleToPink'>
                Sign-in
              </Button>
            </Link>
          </SignedOut>

          
        </div>
      )}
    </Navbar>
  );
}

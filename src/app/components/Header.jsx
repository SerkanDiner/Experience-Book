'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Button, TextInput } from 'flowbite-react';
import MobileSidebar from '@/app/components/MobileSidebar';

const AiOutlineSearch = dynamic(() => import('react-icons/ai').then(mod => mod.AiOutlineSearch));
const FaSun = dynamic(() => import('react-icons/fa').then(mod => mod.FaSun));
const FaMoon = dynamic(() => import('react-icons/fa').then(mod => mod.FaMoon));
const FaHome = dynamic(() => import('react-icons/fa').then(mod => mod.FaHome));
const FaInfoCircle = dynamic(() => import('react-icons/fa').then(mod => mod.FaInfoCircle));
const FaListAlt = dynamic(() => import('react-icons/fa').then(mod => mod.FaListAlt));
const FaBuilding = dynamic(() => import('react-icons/fa').then(mod => mod.FaBuilding));

const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), { ssr: false });
const SignOutButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignOutButton), { ssr: false });
const SignedIn = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedIn), { ssr: false });
const SignedOut = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedOut), { ssr: false });

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: <FaHome /> },
    { href: '/about', label: 'About', icon: <FaInfoCircle /> },
    { href: '/search', label: 'Experiences', icon: <FaListAlt /> },
    { href: '/industries', label: 'Industries', icon: <FaBuilding /> }, // ✅ Added
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

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <>
      <div className="sticky top-0 z-50 border-b-2 bg-white bg-opacity-90 dark:bg-gray-900 backdrop-blur-md px-4 py-2 lg:px-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
          {/* 🔸 Mobile Top Bar */}
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

          {/* 🔶 Desktop Navbar */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Left: Logo + Search */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-2xl font-bold dark:text-white">
                <span className="text-orange-400">Experience Book</span>
              </Link>

              <form onSubmit={handleSubmit} className="relative">
                <TextInput
                  type="text"
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  rightIcon={AiOutlineSearch}
                  className="w-64 rounded-md shadow-sm"
                />
              </form>
            </div>

            {/* Right: Nav + Theme + Auth */}
            <div className="flex items-center gap-5">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-md transition ${
                    path === href
                      ? 'text-orange-500 bg-orange-100 dark:bg-orange-500/10'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}

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
                  <Button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 text-sm font-semibold rounded-md transition">
                    Sign in
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Sidebar */}
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

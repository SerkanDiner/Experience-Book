'use client';

import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
  HiPlus,
  HiMenuAlt2,
  HiX,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashSidebar() {
  const [tab, setTab] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) setTab(tabFromUrl);
  }, [searchParams]);

  if (!isSignedIn) return null;

  const menuItemClass = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;

  return (
    <>
      {/* 📱 Mobile Toggle Button */}
      <div className="md:hidden p-3 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-orange-500 hover:text-orange-600"
        >
          <HiMenuAlt2 size={26} />
        </button>
        <h2 className="text-lg font-bold text-orange-500">Dashboard</h2>
      </div>

      {/* 📱 Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-orange-500">Menu</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-gray-500 hover:text-orange-500"
          >
            <HiX size={26} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 pt-3 pb-6">
          <SidebarItems
            tab={tab}
            setIsOpen={setIsMobileOpen}
            user={user}
            isCollapsed={false}
          />
        </nav>
      </div>

      {/* 💻 Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 ${
          isDesktopCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="text-orange-500 hover:text-orange-600"
            title="Toggle sidebar"
          >
            {isDesktopCollapsed ? <HiMenuAlt2 size={22} /> : <HiX size={22} />}
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 pt-3 pb-6">
          <SidebarItems
            tab={tab}
            setIsOpen={() => {}}
            user={user}
            isCollapsed={isDesktopCollapsed}
          />
        </nav>
      </div>
    </>
  );
}

function SidebarItems({ tab, setIsOpen, user, isCollapsed }) {
  const baseClass = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all';

  const linkClass = (isActive) =>
    `${baseClass} ${
      isActive
        ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;

  const item = (href, label, icon, active, extra = null) => (
    <Link href={href} onClick={() => setIsOpen(false)} key={label}>
      <span className={linkClass(active)}>
        {icon}
        {!isCollapsed && <>{label} {extra}</>}
      </span>
    </Link>
  );

  return (
    <>
      {user?.publicMetadata?.isAdmin &&
        item('/dashboard?tab=dash', 'Dashboard', <HiChartPie className="w-5 h-5" />, tab === 'dash' || !tab)}

      {item(
        '/dashboard?tab=profile',
        'Profile',
        <HiUser className="w-5 h-5" />,
        tab === 'profile',
        !isCollapsed && (
          <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
            {user?.publicMetadata?.isAdmin ? 'Admin' : 'User'}
          </span>
        )
      )}

      {/* ✅ Shared Experiences – available to ALL users */}
      {item('/dashboard?tab=posts', 'Shared Experiences', <HiDocumentText className="w-5 h-5" />, tab === 'posts')}

      {/* ✅ Always visible Create Post link */}
      {item('/dashboard?tab=create-post', 'Create Post', <HiPlus className="w-5 h-5" />, tab === 'create-post')}

      {user?.publicMetadata?.isAdmin &&
        item('/dashboard?tab=users', 'Users', <HiOutlineUserGroup className="w-5 h-5" />, tab === 'users')}

      {user?.publicMetadata?.isAdmin &&
        item('/dashboard?tab=video-publish', 'Video Publish', <HiPlus className="w-5 h-5" />, tab === 'video-publish')}

      {user?.publicMetadata?.isAdmin &&
        item('/dashboard?tab=moderate-posts', 'Moderate Posts', <HiDocumentText className="w-5 h-5" />, tab === 'moderate-posts')}

      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <span
          className={`${baseClass} text-gray-500 dark:text-gray-400 hover:text-orange-500 cursor-pointer`}
        >
          <HiArrowSmRight className="w-5 h-5" />
          {!isCollapsed && <SignOutButton signOutOptions={{ redirectUrl: '/' }} />}
        </span>
      </div>
    </>
  );
}

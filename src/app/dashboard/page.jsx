'use client';

import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/usersComponents/adminComponents/DashPosts';
import AdminTaskTable from '@/components/usersComponents/adminComponents/AdminTaskTable';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashCreate from '../components/usersComponents/adminComponents/DashCreate';
import VideoPublish from './VideoPublish';
import DashModerate from '../components/usersComponents/adminComponents/DashModerate';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const tab = searchParams.get('tab') || 'profile'; // Default to profile

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
        {tab === 'create-post' && <DashCreate />}
        {tab === 'users' && <DashUsers />}
        {tab === 'video-publish' && <VideoPublish />}
        {tab === 'dash' && <DashboardComp />}
        {tab === 'moderate-posts' && <DashModerate />}
        
        {/* New Tasks Management */}
        {tab === 'tasks' && user?.publicMetadata?.isAdmin ? (
          <AdminTaskTable />
        ) : tab === 'tasks' ? (
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
            <p>You don't have permission to access this page.</p>
          </div>
        ) : null}

        {/* Default view when no matching tab */}
        {!['profile', 'posts', 'create-post', 'users', 'video-publish', 'dash', 'moderate-posts', 'tasks'].includes(tab) && (
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {user?.publicMetadata?.isAdmin 
                ? 'Admin Dashboard' 
                : 'Your Dashboard'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {user?.publicMetadata?.isAdmin 
                ? 'Welcome back, Admin! Use the sidebar to manage content.' 
                : 'Welcome to your personal dashboard!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
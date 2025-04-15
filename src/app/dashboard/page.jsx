'use client';

import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashCreate from '../components/DashCreate';
import CompleteProfileForm from '@/app/components/CompleteProfileForm';

import VideoPublish from './VideoPublish';
import DashModerate from '../components/DashModerate';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'profile'; // ✅ Default fallback

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
        {tab === 'complete-profile' && <CompleteProfileForm />}

        {tab === 'create-post' && <DashCreate />}
        {tab === 'users' && <DashUsers />}
        {tab === 'video-publish' && <VideoPublish />}
        {tab === 'dash' && <DashboardComp />}
        {tab === 'moderate-posts' && <DashModerate />}
      </div>
    </div>
  );
}

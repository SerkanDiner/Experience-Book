'use client';

import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';


import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import DashCreate from '../components/usersComponents/adminComponents/DashCreate';
import VideoPublish from './VideoPublish';
import DashModerate from '../components/usersComponents/adminComponents/DashModerate';
import DashPublicProfile from '../components/usersComponents/noAdminComponents/DashPublicProfile';
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
        {tab === 'public-profile' && <DashPublicProfile />}
        {tab === 'create-post' && <DashCreate />}
        {tab === 'users' && <DashUsers />}
        {tab === 'video-publish' && <VideoPublish />}
        {tab === 'dash' && <DashboardComp />}
        {tab === 'moderate-posts' && <DashModerate />}
        
      

       
      </div>
    </div>
  );
}
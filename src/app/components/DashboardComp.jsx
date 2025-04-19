'use client';

import { HiUsers, HiDocumentText, HiStar, HiChartBar, HiOutlineArrowSmRight } from 'react-icons/hi';
import { useUser } from '@clerk/nextjs';

export default function DashboardComp() {
  const { user } = useUser();

  // Sample data - replace with real API calls
  const stats = [
    { title: 'Total Users', value: '1,243', icon: <HiUsers className="text-2xl" />, change: '+12%' },
    { title: 'Active Tasks', value: '56', icon: <HiDocumentText className="text-2xl" />, change: '+5%' },
    { title: 'XP Earned (Total)', value: '42,850', icon: <HiStar className="text-2xl" />, change: '+23%' },
    { title: 'Engagement Rate', value: '68%', icon: <HiChartBar className="text-2xl" />, change: '+3%' }
  ];

  const recentActivities = [
    { id: 1, user: 'Alex Johnson', action: 'completed "Career Reflection" task', xp: 5, time: '2 hours ago' },
    { id: 2, user: 'Sam Wilson', action: 'published new article', xp: 100, time: '5 hours ago' },
    { id: 3, user: 'Jordan Lee', action: 'achieved Silver rank', xp: 0, time: '1 day ago' }
  ];

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold dark:text-white">
        {user?.publicMetadata?.isAdmin ? 'Admin Dashboard' : 'Your Dashboard'}
      </h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 dark:text-white">{stat.value}</p>
              </div>
              <div className="text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <p className="text-sm mt-2 text-green-500">{stat.change} from last week</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold dark:text-white">Recent Activity</h3>
          <button className="text-sm text-orange-500 flex items-center gap-1">
            View all <HiOutlineArrowSmRight />
          </button>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {activity.user.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium dark:text-gray-300">
                    <span className="text-orange-500">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time} {activity.xp > 0 && `• ${activity.xp} XP earned`}
                  </p>
                </div>
              </div>
              <button className="text-sm text-orange-500 hover:underline">Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// components/DashUsers.jsx
'use client';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

export default function DashUsers() {
  // Sample user data
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', xp: 1250, joined: '2023-10-15' },
    { id: 2, name: 'Sam Wilson', email: 'sam@example.com', role: 'User', xp: 850, joined: '2023-11-02' },
    { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', role: 'User', xp: 420, joined: '2023-11-15' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">XP</th>
              <th className="py-3 px-4 text-left">Joined</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  {user.name}
                </td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'Admin' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">{user.xp} XP</td>
                <td className="py-3 px-4">{user.joined}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="text-orange-500 hover:text-orange-700">
                    <HiOutlinePencil />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <HiOutlineTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
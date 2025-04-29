'use client';
import { useEffect, useState } from 'react';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineUserGroup } from 'react-icons/hi';

export default function DashUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/get-users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 pl-64 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <HiOutlineUserGroup className="text-3xl text-orange-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h2>
        </div>
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-72 border-2 border-orange-400 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <table className="min-w-full">
          <thead className="bg-orange-100 dark:bg-gray-700 rounded-t-lg">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-gray-600 dark:text-gray-300">User</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-600 dark:text-gray-300">Email</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-600 dark:text-gray-300">Role</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-600 dark:text-gray-300">XP</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-600 dark:text-gray-300">Joined</th>
              <th className="py-4 px-6 text-left font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-orange-50 dark:hover:bg-gray-700/50 transition">
                <td className="py-4 px-6 flex items-center gap-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  )}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
                </td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.isAdmin 
                      ? 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.xp} XP</td>
                <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-6 flex gap-2">
                  <button className="p-2 rounded-full hover:bg-orange-200 dark:hover:bg-orange-400/20 transition">
                    <HiOutlinePencil className="text-orange-400 text-xl" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-400/20 transition">
                    <HiOutlineTrash className="text-red-500 text-xl" />
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

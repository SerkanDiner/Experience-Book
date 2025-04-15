import { getAllUserProfiles } from '@/lib/actions/userProfile';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle, Briefcase, MapPin } from 'lucide-react';

export const metadata = {
  title: 'All Members – Experience Book',
  description: 'Browse all professionals sharing experiences on Experience Book.',
};

export default async function AllUsersPage() {
  const users = await getAllUserProfiles();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <UserCircle className="w-7 h-7 text-orange-500" />
          Meet Our Members
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto text-sm">
          Discover inspiring professionals from diverse industries who are shaping the world through shared experiences.
        </p>
      </div>

      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((user) => (
            <Link
              key={user._id}
              href={`/users/${user.username}`}
              className="group border rounded-xl p-5 hover:shadow-xl hover:border-orange-400 transition bg-white dark:bg-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                  <Image
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.username}
                    fill
                    className="rounded-full object-cover border-2 border-orange-100 dark:border-gray-700"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition">
                    @{user.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.jobTitle && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-orange-400" />
                      {user.jobTitle}
                    </p>
                  )}
                  {user.profile?.country && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      {user.profile.country}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

// components/LeaderboardTable.js
export default function LeaderboardTable({ users }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Rank</th>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">XP</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b flex items-center">
                  <img 
                    src={user.profilePicture || '/default-avatar.png'} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {user.username}
                </td>
                <td className="py-2 px-4 border-b">{user.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
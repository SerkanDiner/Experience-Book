// components/AdminTaskTable.js


export default function AdminTaskTable({ tasks }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Question</th>
            <th className="py-2 px-4 border-b">XP</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="py-2 px-4 border-b">{task.category}</td>
              <td className="py-2 px-4 border-b">{task.question}</td>
              <td className="py-2 px-4 border-b">{task.xp}</td>
              <td className="py-2 px-4 border-b">
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
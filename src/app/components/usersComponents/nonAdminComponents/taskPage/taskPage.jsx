'use client';

import { useEffect, useState } from 'react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Available Tasks</h1>

      <div className="space-y-6">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 border rounded-lg dark:bg-gray-800">
            <h2 className="text-lg font-semibold">{task.category}</h2>
            <p className="mt-2">{task.question}</p>
            <p className="mt-2 text-sm text-gray-500">XP Reward: {task.xp} XP</p>
          </div>
        ))}
      </div>
    </div>
  );
}

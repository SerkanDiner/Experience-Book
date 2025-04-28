'use client';

import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { HiOutlineExclamationCircle, HiPlus } from 'react-icons/hi';

export default function AdminTaskTable() {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState('');
  const [newTask, setNewTask] = useState({
    category: 'Writing',
    question: '',
    xp: 5,
  });

  useEffect(() => {
    if (user?.publicMetadata?.isAdmin) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/tasks/post');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleDeleteTask = async () => {
    setShowDeleteModal(false);
    try {
      const res = await fetch(`/api/admin/tasks/post?id=${taskIdToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/tasks/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newTask.category,
          question: newTask.question,
          xp: Number(newTask.xp),
        }),
      });
      if (res.ok) {
        setNewTask({ category: 'Writing', question: '', xp: 5 });
        setShowCreateModal(false);
        fetchTasks();
      } else {
        const errorText = await res.text();
        console.error('Failed to create task:', errorText);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className='flex items-center justify-center h-full p-8'>
        <h1 className='text-2xl font-semibold'>You are not authorized to view this page.</h1>
      </div>
    );
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold dark:text-white'>Manage Tasks</h2>
        <Button 
          color='success' 
          onClick={() => setShowCreateModal(true)}
        >
          <HiPlus className='mr-2' /> Create Task
        </Button>
      </div>

      {tasks.length > 0 ? (
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Question</Table.HeadCell>
            <Table.HeadCell>XP</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {tasks.map((task) => (
              <Table.Row key={task._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{task.category}</Table.Cell>
                <Table.Cell>{task.question}</Table.Cell>
                <Table.Cell>{task.xp}</Table.Cell>
                <Table.Cell>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setTaskIdToDelete(task._id);
                    }}
                    className='font-medium text-red-500 hover:underline'
                  >
                    Delete
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>No tasks found.</p>
      )}

      {/* Create Task Modal */}
      <Modal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleCreateTask} className='space-y-4'>
            <h3 className='text-xl font-medium text-gray-900 dark:text-white'>Create New Task</h3>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className='w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600'
                required
              >
                <option value='Writing'>Writing</option>
                <option value='Reading'>Reading</option>
                <option value='Watching'>Watching</option>
                <option value='Community'>Community</option>
                <option value='Support'>Support</option>
              </select>
            </div>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Question/Task</label>
              <input
                type='text'
                value={newTask.question}
                onChange={(e) => setNewTask({ ...newTask, question: e.target.value })}
                className='w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600'
                placeholder='Enter task question'
                required
              />
            </div>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>XP Value</label>
              <input
                type='number'
                value={newTask.xp}
                onChange={(e) => setNewTask({ ...newTask, xp: parseInt(e.target.value) || 0 })}
                className='w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600'
                min='1'
                required
              />
            </div>
            <div className='flex justify-end gap-3'>
              <Button 
                color='gray' 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type='submit' color='success'>
                Create Task
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        popup 
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this task?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteTask}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

'use client';

import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashModerate() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch('/api/post/get?admin=true');
        const data = await res.json();
        if (res.ok) setPosts(data.posts);
      } catch (error) {
        console.log('Fetch error:', error.message);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchAllPosts();
    }
  }, [user]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: postIdToDelete }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = posts.filter(post => post._id !== postIdToDelete);
        setPosts(updated);
        setPostIdToDelete('');
      } else {
        console.log('Delete error:', data.message);
      }
    } catch (error) {
      console.log('Delete request error:', error.message);
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
      {posts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Author</Table.HeadCell>
              <Table.HeadCell>Industry</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body className='divide-y' key={post._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link href={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.author}</Table.Cell>
                  <Table.Cell>{post.industry}</Table.Cell>
                  <Table.Cell>
                    <span
                      className='text-red-500 cursor-pointer hover:underline'
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>No user posts found.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

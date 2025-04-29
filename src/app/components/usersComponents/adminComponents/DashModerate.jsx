'use client';

import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { HiOutlineExclamationCircle, HiOutlineClipboardList, HiOutlineTrash } from 'react-icons/hi';

export default function DashModerate() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    if (user && user.publicMetadata?.isAdmin) {
      const fetchAllPosts = async () => {
        try {
          const res = await fetch('/api/post/get', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin: true }),
          });
  
          const data = await res.json();
          if (res.ok) setPosts(data.posts);
        } catch (error) {
          console.log('Fetch error:', error.message);
        }
      };
  
      fetchAllPosts();
    }
  }, [user]);
  

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postIdToDelete,
          userId: user?.publicMetadata?.userMongoId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newPosts = posts.filter(post => post._id !== postIdToDelete);
        setPosts(newPosts);
        setPostIdToDelete('');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <h1 className="text-2xl font-semibold">You are not authorized to view this page.</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-8">
        <HiOutlineClipboardList className="text-3xl text-orange-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Moderate User Posts</h2>
      </div>

      {posts.length > 0 ? (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <Table hoverable striped className="min-w-[720px]">
            <Table.Head className="bg-orange-100 dark:bg-gray-700 text-sm md:text-base">
              <Table.HeadCell className="text-gray-700 dark:text-gray-200 px-2 py-3">Date</Table.HeadCell>
              <Table.HeadCell className="text-gray-700 dark:text-gray-200 px-2 py-3">Image</Table.HeadCell>
              <Table.HeadCell className="text-gray-700 dark:text-gray-200 px-2 py-3">Title</Table.HeadCell>
              <Table.HeadCell className="text-gray-700 dark:text-gray-200 px-2 py-3">Author</Table.HeadCell>
              <Table.HeadCell className="text-gray-700 dark:text-gray-200 px-2 py-3">Industry</Table.HeadCell>
              <Table.HeadCell className="text-gray-700 dark:text-gray-200 text-center px-2 py-3">Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y text-sm md:text-base">
              {posts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 transition"
                >
                  <Table.Cell className="px-2 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="px-2 py-2">
                    <Link href={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-12 md:w-24 md:h-14 rounded object-cover bg-gray-200"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="px-2 py-2">
                    <Link href={`/post/${post.slug}`}>
                      <span className="font-semibold text-gray-800 dark:text-gray-100 hover:underline">
                        {post.title}
                      </span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="px-2 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {post.author}
                  </Table.Cell>
                  <Table.Cell className="px-2 py-2 text-gray-600 dark:text-gray-300 capitalize whitespace-nowrap">
                    {post.industry}
                  </Table.Cell>
                  <Table.Cell className="px-2 py-2 text-center">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 md:p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-400/20 transition"
                    >
                      <HiOutlineTrash className="text-lg md:text-xl" />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 mt-4">No user posts found.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '@/components/PostCard';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function TrashPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch deleted posts on mount
  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const res = await axios.get('/api/posts/trash');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching trash:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrash();
  }, []);

  // Handle restore post
  const handleRestore = async (postId: string) => {
    try {
      await axios.post(`/api/posts/${postId}/restore`);
      setPosts((prev) => prev.filter((post: any) => post._id !== postId));
      alert('Post restored!');
    } catch (error) {
      console.error('Restore error:', error);
      alert('Failed to restore post');
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto z-10 relative">
        <h1
          className="text-3xl font-bold text-gray-800 mb-8"
          style={{ fontFamily: 'Montserrat' }}
        >
          🗑️ Trash
        </h1>

        {loading ? (
          <p className="text-gray-500" style={{ fontFamily: 'Montserrat' }}>Loading trash...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500" style={{ fontFamily: 'Montserrat' }}>
            Trash is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post: any) => (
              <div key={post._id} className="relative">
                <PostCard
                  _id={post._id}
                  title={post.title}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  dislikes={post.dislikes}
                  authorName={post.userId?.username || 'Unknown'}
                  createdAt={post.createdAt}
                />

                {/* Restore Button (Circular) */}
                <div className="absolute -bottom-4 right-4">
                  <button
                    onClick={() => handleRestore(post._id)}
                    className="w-10 h-10 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
                    title="Restore post"
                  >
                    ♻️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

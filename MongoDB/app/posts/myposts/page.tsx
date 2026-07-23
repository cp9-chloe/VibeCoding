'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PostCard from '@/components/PostCard';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch my posts on mount
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get('/api/posts/myposts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching my posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  // Handle delete post
  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts((prev) => prev.filter((post: any) => post._id !== postId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
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
          My Posts
        </h1>

        {loading ? (
          <p className="text-gray-500" style={{ fontFamily: 'Montserrat' }}>Loading your posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 mb-4" style={{ fontFamily: 'Montserrat' }}>
              You haven&apos;t created any posts yet.
            </p>
            <button
              onClick={() => router.push('/posts/new')}
              className="px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
              style={{ fontFamily: 'Montserrat' }}
            >
              Create Your First Post
            </button>
          </div>
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

                {/* Edit and Delete Buttons (Circular) */}
                <div className="absolute -bottom-4 right-4 flex gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => router.push(`/posts/${post._id}/edit`)}
                    className="w-10 h-10 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center text-sm"
                    title="Edit post"
                  >
                    ✏️
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="w-10 h-10 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                    title="Delete post"
                  >
                    🗑️
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

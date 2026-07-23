'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '@/components/PostCard';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch all posts on mount and when search changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = search ? `/api/posts?search=${encodeURIComponent(search)}` : '/api/posts';
        const res = await axios.get(url);
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [search]);

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto z-10 relative">
        <h1
          className="text-3xl font-bold text-gray-800 mb-6"
          style={{ fontFamily: 'Montserrat' }}
        >
          All Posts
        </h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
            style={{ fontFamily: 'Montserrat' }}
          />
        </div>

        {loading ? (
          <p className="text-gray-500" style={{ fontFamily: 'Montserrat' }}>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500" style={{ fontFamily: 'Montserrat' }}>
            {search ? 'No posts found matching your search.' : 'No posts yet. Be the first to create one!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post: any) => (
              <PostCard
                key={post._id}
                _id={post._id}
                title={post.title}
                content={post.content}
                image={post.image}
                likes={post.likes}
                dislikes={post.dislikes}
                authorName={post.userId?.username || 'Unknown'}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

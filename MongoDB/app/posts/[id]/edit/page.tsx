'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import PostForm from '@/components/PostForm';
import BackButton from '@/components/BackButton';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch post data on mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}`);
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Handle form submission
  const handleSubmit = async (data: { title: string; content: string; image?: string }) => {
    try {
      await axios.put(`/api/posts/${postId}`, data);
      router.push('/posts/myposts');
      router.refresh();
    } catch (error) {
      console.error('Update post error:', error);
      alert('Failed to update post');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <AnimatedBackground />
        <BackButton />
        <p className="text-center text-gray-500" style={{ fontFamily: 'Montserrat' }}>Loading...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <AnimatedBackground />
        <BackButton />
        <p className="text-center text-gray-500" style={{ fontFamily: 'Montserrat' }}>Post not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <AnimatedBackground />
      <BackButton />

      <div className="max-w-2xl mx-auto z-10 relative">
        <h1
          className="text-3xl font-bold text-gray-800 mb-8"
          style={{ fontFamily: 'Montserrat' }}
        >
          Edit Post
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <PostForm
            initialTitle={(post as any).title}
            initialContent={(post as any).content}
            initialImage={(post as any).image || ''}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PostForm from '@/components/PostForm';
import AIChatbot from '@/components/AIChatbot';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function NewPostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');

  // Handle form submission
  const handleSubmit = async (data: { title: string; content: string; image?: string }) => {
    try {
      await axios.post('/api/posts', data);
      router.push('/posts');
      router.refresh();
    } catch (error) {
      console.error('Create post error:', error);
      alert('Failed to create post. Make sure you are logged in.');
    }
  };

  // Insert AI text into content
  const handleInsertText = (text: string) => {
    setContent((prev) => prev + '\n\n' + text);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <AnimatedBackground />

      <div className="max-w-2xl mx-auto z-10 relative">
        <h1
          className="text-3xl font-bold text-gray-800 mb-8"
          style={{ fontFamily: 'Montserrat' }}
        >
          Create New Post
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <PostForm onSubmit={handleSubmit} submitLabel="Publish Post" />
        </div>

        {/* AI Chatbot */}
        <AIChatbot onInsertText={handleInsertText} />
      </div>
    </main>
  );
}

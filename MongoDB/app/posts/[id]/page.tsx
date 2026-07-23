'use client';

import PostDetail from '@/components/PostDetail';
import BackButton from '@/components/BackButton';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useParams } from 'next/navigation';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <AnimatedBackground />
      <BackButton />

      <div className="z-10 relative">
        <PostDetail postId={postId} />
      </div>
    </main>
  );
}

'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-20 left-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-gray-600 hover:text-purple-600 z-40"
      title="Go back"
    >
      ←
    </button>
  );
}

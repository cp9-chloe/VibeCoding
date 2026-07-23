import Link from 'next/link';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="text-center z-10">
        <h1
          className="text-5xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Montserrat' }}
        >
          AI Blog
        </h1>
        <p
          className="text-lg text-gray-600 mb-8 max-w-md"
          style={{ fontFamily: 'Montserrat' }}
        >
          Share your thoughts, get AI writing assistance, and connect with other writers.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/posts"
            className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-lg"
            style={{ fontFamily: 'Montserrat' }}
          >
            Browse All Posts
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors shadow-lg border border-purple-200"
            style={{ fontFamily: 'Montserrat' }}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="text-3xl mb-3">✍️</div>
          <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat' }}>
            Write Posts
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat' }}>
            Create and share your blog posts with optional images.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat' }}>
            AI Assistant
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat' }}>
            Get writing ideas and tips from our AI chatbot.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat' }}>
            Interact
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat' }}>
            Like, dislike, and comment on posts.
          </p>
        </div>
      </div>
    </main>
  );
}

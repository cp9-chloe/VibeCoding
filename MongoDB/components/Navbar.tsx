'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      setIsLoggedIn(false);
      setUsername('');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side: Logo */}
        <Link href="/" className="text-xl font-bold text-purple-600" style={{ fontFamily: 'Montserrat' }}>
          ByteHorizon.com
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/posts"
            className="px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
            style={{ fontFamily: 'Montserrat' }}
          >
            All Posts
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/posts/myposts"
                className="px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                My Posts
              </Link>
              <Link
                href="/posts/new"
                className="px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                New Post
              </Link>
            </>
          )}
        </div>

        {/* Right side: Auth Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/settings"
                className="px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Settings
              </Link>
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat' }}>
                {username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

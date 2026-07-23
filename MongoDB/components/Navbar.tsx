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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-lg dark:border-b dark:border-slate-700 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side: Logo */}
        <Link href="/" className="text-xl font-bold text-purple-600 dark:text-purple-400" style={{ fontFamily: 'Montserrat' }}>
          Blog
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/posts"
            className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/posts/myposts"
                className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              </Link>
              <Link
                href="/posts/trash"
                className="px-3 py-1 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                🗑️ Trash
              </Link>
              <Link
                href="/posts/new"
                className="px-3 py-1 rounded-full text-sm font-medium bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
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
                className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Settings
              </Link>
              <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Montserrat' }}>
                {username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 rounded-full text-sm font-medium bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
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

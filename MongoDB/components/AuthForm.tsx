'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Props that AuthForm accepts
interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Sign up
        const res = await axios.post('/api/auth/signup', { username, email, password });
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', username);
      } else {
        // Login
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', res.data.username);
      }

      router.push('/posts');
      router.refresh();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Something went wrong';

      if (mode === 'signup' && errorMsg.toLowerCase().includes('already exists')) {
        setError('error, username taken');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center" style={{ fontFamily: 'Montserrat' }}>
        {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm" style={{ fontFamily: 'Montserrat' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Montserrat' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ fontFamily: 'Montserrat' }}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Montserrat' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ fontFamily: 'Montserrat' }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Montserrat' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ fontFamily: 'Montserrat' }}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          style={{ fontFamily: 'Montserrat' }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-purple-600 hover:underline">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="/login" className="text-purple-600 hover:underline">
              Login
            </a>
          </>
        )}
      </p>
    </div>
  );
}

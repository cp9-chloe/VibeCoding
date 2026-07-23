import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env.local');
}

// Generate a JWT token for a user
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify and decode a JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Get the current user ID from the request cookies
export function getCurrentUserId(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

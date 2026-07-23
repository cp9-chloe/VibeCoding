import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { getCurrentUserId } from '@/lib/auth';

// GET /api/posts/myposts - Fetch posts by the logged-in user
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if user is logged in
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    // Get all posts by this user, sorted by newest first
    const posts = await Post.find({ userId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Fetch my posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

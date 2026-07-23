import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { getCurrentUserId } from '@/lib/auth';

// GET /api/posts - Fetch all posts (for All Posts page)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get all posts, sorted by newest first
    // Populate userId to get the username of the post author
    const posts = await Post.find({})
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check if user is logged in
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to create a post' }, { status: 401 });
    }

    const { title, content, image } = await request.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Create the new post
    const post = await Post.create({
      userId,
      title,
      content,
      image: image || null,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

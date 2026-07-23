import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { getCurrentUserId } from '@/lib/auth';

interface Params {
  params: { id: string };
}

// POST /api/posts/[id]/restore - Restore a deleted post
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    // Check if user is logged in
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    // Find the post
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if the user owns this post
    if (post.userId.toString() !== userId) {
      return NextResponse.json({ error: 'You can only restore your own posts' }, { status: 403 });
    }

    // Restore the post
    post.deleted = false;
    await post.save();

    return NextResponse.json({ message: 'Post restored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Restore post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

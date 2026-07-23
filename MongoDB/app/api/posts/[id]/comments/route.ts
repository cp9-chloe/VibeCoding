import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { getCurrentUserId } from '@/lib/auth';

interface Params {
  params: { id: string };
}

// GET /api/posts/[id]/comments - Fetch comments for a post
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    // Get all comments for this post, sorted by newest first
    // Populate userId to get the username of the comment author
    const comments = await Comment.find({ postId: params.id })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/posts/[id]/comments - Add a comment to a post
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    // Check if user is logged in
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to comment' }, { status: 401 });
    }

    const { content } = await request.json();

    // Validate content
    if (!content) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Create the new comment
    const comment = await Comment.create({
      postId: params.id,
      userId,
      content,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

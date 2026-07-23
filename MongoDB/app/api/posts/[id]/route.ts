import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { getCurrentUserId } from '@/lib/auth';

interface Params {
  params: { id: string };
}

// GET /api/posts/[id] - Fetch a single post by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    const post = await Post.findById(params.id).populate('userId', 'username');

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Fetch post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update/edit a post
export async function PUT(request: NextRequest, { params }: Params) {
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
      return NextResponse.json({ error: 'You can only edit your own posts' }, { status: 403 });
    }

    const { title, content, image } = await request.json();

    // Update the post
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;
    await post.save();

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Soft delete a post (move to trash)
export async function DELETE(request: NextRequest, { params }: Params) {
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
      return NextResponse.json({ error: 'You can only delete your own posts' }, { status: 403 });
    }

    // Soft delete - mark as deleted instead of removing
    post.deleted = true;
    await post.save();

    return NextResponse.json({ message: 'Post moved to trash' }, { status: 200 });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { getCurrentUserId } from '@/lib/auth';

interface Params {
  params: { id: string };
}

// POST /api/posts/[id]/like - Like or unlike a post (toggle)
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

    const userIdObj = userId as any;

    // Check if user already liked this post
    const alreadyLiked = post.likedBy.includes(userIdObj);

    if (alreadyLiked) {
      // Unlike: remove user from likedBy, decrease likes count
      post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
      post.likes -= 1;
    } else {
      // Like: add user to likedBy, increase likes count
      // Also remove from dislikedBy if they previously disliked
      if (post.dislikedBy.includes(userIdObj)) {
        post.dislikedBy = post.dislikedBy.filter((id) => id.toString() !== userId);
        post.dislikes -= 1;
      }
      post.likedBy.push(userIdObj);
      post.likes += 1;
    }

    await post.save();

    return NextResponse.json(
      { likes: post.likes, dislikes: post.dislikes, liked: !alreadyLiked },
      { status: 200 }
    );
  } catch (error) {
    console.error('Like post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

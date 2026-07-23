import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import { getCurrentUserId } from '@/lib/auth';

interface Params {
  params: { id: string };
}

// POST /api/posts/[id]/dislike - Dislike or undislike a post (toggle)
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

    // Check if user already disliked this post
    const alreadyDisliked = post.dislikedBy.includes(userIdObj);

    if (alreadyDisliked) {
      // Undislike: remove user from dislikedBy, decrease dislikes count
      post.dislikedBy = post.dislikedBy.filter((id) => id.toString() !== userId);
      post.dislikes -= 1;
    } else {
      // Dislike: add user to dislikedBy, increase dislikes count
      // Also remove from likedBy if they previously liked
      if (post.likedBy.includes(userIdObj)) {
        post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
        post.likes -= 1;
      }
      post.dislikedBy.push(userIdObj);
      post.dislikes += 1;
    }

    await post.save();

    return NextResponse.json(
      { likes: post.likes, dislikes: post.dislikes, disliked: !alreadyDisliked },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dislike post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

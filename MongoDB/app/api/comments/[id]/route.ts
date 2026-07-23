import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { getCurrentUserId } from '@/lib/auth';

interface Params {
  params: { id: string };
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    // Check if user is logged in
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    // Find the comment
    const comment = await Comment.findById(params.id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if the user owns this comment
    if (comment.userId.toString() !== userId) {
      return NextResponse.json({ error: 'You can only delete your own comments' }, { status: 403 });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

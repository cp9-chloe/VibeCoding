'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// Props that PostDetail accepts
interface PostDetailProps {
  postId: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: { username: string };
  createdAt: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Fetch post and comments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`/api/posts/${postId}`),
          axios.get(`/api/posts/${postId}/comments`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Get current user
    const userId = localStorage.getItem('userId');
    setCurrentUser(userId);

    fetchData();
  }, [postId]);

  // Handle like
  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like`);
      setPost((prev: any) => ({
        ...prev,
        likes: res.data.likes,
        dislikes: res.data.dislikes,
      }));
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // Handle dislike
  const handleDislike = async () => {
    try {
      const res = await axios.post(`/api/posts/${postId}/dislike`);
      setPost((prev: any) => ({
        ...prev,
        likes: res.data.likes,
        dislikes: res.data.dislikes,
      }));
    } catch (error) {
      console.error('Dislike error:', error);
    }
  };

  // Handle add comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`/api/posts/${postId}/comments`, { content: newComment });
      setNewComment('');
      // Refresh comments
      const commentsRes = await axios.get(`/api/posts/${postId}/comments`);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8" style={{ fontFamily: 'Montserrat' }}>Loading...</div>;
  }

  if (!post) {
    return <div className="text-center py-8" style={{ fontFamily: 'Montserrat' }}>Post not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Post Image */}
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      )}

      {/* Post Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat' }}>
        {post.title}
      </h1>

      {/* Author and Date */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>
        <span>by {post.userId?.username || 'Unknown'}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Post Content (Courier New) */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Courier New' }}>
          {post.content}
        </p>
      </div>

      {/* Like/Dislike Buttons */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
          style={{ fontFamily: 'Montserrat' }}
        >
          👍 {post.likes}
        </button>
        <button
          onClick={handleDislike}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
          style={{ fontFamily: 'Montserrat' }}
        >
          👎 {post.dislikes}
        </button>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat' }}>
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {currentUser && (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              style={{ fontFamily: 'Courier New' }}
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
              style={{ fontFamily: 'Montserrat' }}
            >
              Post Comment
            </button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800" style={{ fontFamily: 'Montserrat' }}>
                  {comment.userId?.username || 'Unknown'}
                </span>
                <span className="text-sm text-gray-400" style={{ fontFamily: 'Montserrat' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600" style={{ fontFamily: 'Courier New' }}>
                {comment.content}
              </p>
              {currentUser === comment.userId?._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="mt-2 text-sm text-red-500 hover:text-red-700"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

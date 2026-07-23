'use client';

import Link from 'next/link';

// Props that PostCard accepts
interface PostCardProps {
  _id: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  dislikes: number;
  commentCount?: number;
  authorName: string;
  createdAt: string;
}

export default function PostCard({
  _id,
  title,
  content,
  image,
  likes,
  dislikes,
  commentCount = 0,
  authorName,
  createdAt,
}: PostCardProps) {
  // Truncate content to show only a preview
  const previewContent = content.length > 150 ? content.substring(0, 150) + '...' : content;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Author and Date */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>
          by {authorName}
        </span>
        <span className="text-sm text-gray-400" style={{ fontFamily: 'Montserrat' }}>
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Post Image (if exists) */}
      {image && (
        <div className="mb-4">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>
      )}

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat' }}>
        {title}
      </h2>

      {/* Content Preview (Courier New for post text) */}
      <p className="text-gray-600 mb-4" style={{ fontFamily: 'Courier New' }}>
        {previewContent}
      </p>

      {/* Stats: Likes, Dislikes, Comments */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>
        <span>👍 {likes}</span>
        <span>👎 {dislikes}</span>
        <span>💬 {commentCount}</span>
      </div>

      {/* View Details Link */}
      <Link
        href={`/posts/${_id}`}
        className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
        style={{ fontFamily: 'Montserrat' }}
      >
        View Details
      </Link>
    </div>
  );
}

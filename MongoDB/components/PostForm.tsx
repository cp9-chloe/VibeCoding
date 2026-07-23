'use client';

import { useState } from 'react';

// Props that PostForm accepts
interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImage?: string;
  onSubmit: (data: { title: string; content: string; image?: string }) => void;
  submitLabel?: string;
}

export default function PostForm({
  initialTitle = '',
  initialContent = '',
  initialImage = '',
  onSubmit,
  submitLabel = 'Create Post',
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [image, setImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(initialImage);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setImage('');
    setImagePreview('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, image: image || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat' }}>
          Post Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your post title..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ fontFamily: 'Montserrat' }}
          required
        />
      </div>

      {/* Content Input (Courier New for post text) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat' }}>
          Post Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ fontFamily: 'Courier New' }}
          rows={10}
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat' }}>
          Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ fontFamily: 'Montserrat' }}
        />
        {imagePreview && (
          <div className="mt-4 relative">
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
        style={{ fontFamily: 'Montserrat' }}
      >
        {submitLabel}
      </button>
    </form>
  );
}

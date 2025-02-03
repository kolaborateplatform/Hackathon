import { useState } from 'react';
import { Platform, Post } from '../../types';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Partial<Post>) => void;
}

export default function PostModal({ isOpen, onClose, onSubmit }: PostModalProps) {
  const [post, setPost] = useState({
    title: '',
    content: '',
    platform: '' as Platform,
    mediaUrl: '',
    caption: '',
    scheduledDate: new Date(),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(post);
        }}>
          <div className="space-y-4">
            <select
              value={post.platform}
              onChange={(e) => setPost({ ...post, platform: e.target.value as Platform })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Platform</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="X">X</option>
              <option value="TikTok">TikTok</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>

            <input
              type="text"
              placeholder="Title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full p-2 border rounded"
            />

            <textarea
              placeholder="Content"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="w-full p-2 border rounded h-32"
            />

            <input
              type="file"
              onChange={(e) => {
                // Handle file upload logic here
              }}
              className="w-full p-2 border rounded"
            />

            <textarea
              placeholder="Caption"
              value={post.caption}
              onChange={(e) => setPost({ ...post, caption: e.target.value })}
              className="w-full p-2 border rounded h-24"
            />

            <input
              type="datetime-local"
              value={post.scheduledDate.toISOString().slice(0, 16)}
              onChange={(e) => setPost({ ...post, scheduledDate: new Date(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
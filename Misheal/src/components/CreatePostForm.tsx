import React, { useState } from 'react';
import { useCalendarStore } from '../store';
import { Platform } from '../types';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../utils';

const TikTokIcon = ({ size = 24, className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const CreatePostForm = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  const { addPost } = useCalendarStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPost({
      id: crypto.randomUUID(),
      title,
      content,
      platform,
      date,
      time,
      mediaUrl,
      mediaType,
    });
    onClose();
  };

  const platformIcons = {
    instagram: { icon: Instagram, label: 'Instagram' },
    twitter: { icon: Twitter, label: 'Twitter' },
    facebook: { icon: Facebook, label: 'Facebook' },
    linkedin: { icon: Linkedin, label: 'LinkedIn' },
    tiktok: { icon: TikTokIcon, label: 'TikTok' },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform
        </label>
        <div className="flex gap-4">
          {Object.entries(platformIcons).map(([key, { icon: Icon, label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPlatform(key as Platform)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                platform === key
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media Type
        </label>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setMediaType('image')}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors',
              mediaType === 'image'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Image
          </button>
          <button
            type="button"
            onClick={() => setMediaType('video')}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors',
              mediaType === 'video'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Video
          </button>
        </div>
        <input
          type="url"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder={`Enter ${mediaType} URL`}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Create Post
        </button>
      </div>
    </form>
  );
};
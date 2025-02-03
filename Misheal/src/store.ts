import { create } from 'zustand';
import { Post, Platform } from './types';

interface CalendarStore {
  posts: Post[];
  selectedPlatforms: Platform[];
  viewType: 'calendar' | 'list';
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  togglePlatform: (platform: Platform) => void;
  setViewType: (type: 'calendar' | 'list') => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  posts: [],
  selectedPlatforms: ['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok'],
  viewType: 'calendar',
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  updatePost: (post) => set((state) => ({
    posts: state.posts.map((p) => (p.id === post.id ? post : p)),
  })),
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter((p) => p.id !== id),
  })),
  togglePlatform: (platform) => set((state) => ({
    selectedPlatforms: state.selectedPlatforms.includes(platform)
      ? state.selectedPlatforms.filter((p) => p !== platform)
      : [...state.selectedPlatforms, platform],
  })),
  setViewType: (type) => set({ viewType: type }),
}));
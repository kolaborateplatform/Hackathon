export type Platform = 'Instagram' | 'Facebook' | 'X' | 'TikTok' | 'LinkedIn';

export type PostType = 'image' | 'video' | 'story' | 'text';

export type AccessRight = 'view' | 'edit' | 'admin';

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  mediaUrl?: string;
  caption: string;
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published';
  createdBy: string;
  lastModified: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: AccessRight;
} 
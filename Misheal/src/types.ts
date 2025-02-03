export type Platform = 'Instagram' | 'Facebook' | 'X' | 'TikTok' | 'LinkedIn';

export interface Post {
  title: string;
  content: string;
  platform: Platform;
  mediaUrl: string;
  caption: string;
  scheduledDate: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  platform: Platform;
  content: string;
  backgroundColor: string;
  borderColor: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isPast: boolean;
  isToday: boolean;
}
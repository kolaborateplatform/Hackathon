import { Platform } from './types';

export const platformColors: Record<Platform, { bg: string; border: string }> = {
  instagram: { bg: '#E1306C', border: '#C13584' },
  twitter: { bg: '#1DA1F2', border: '#1991DA' },
  facebook: { bg: '#4267B2', border: '#385899' },
  linkedin: { bg: '#0077B5', border: '#006699' },
  tiktok: { bg: '#000000', border: '#25F4EE' },
};

export const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
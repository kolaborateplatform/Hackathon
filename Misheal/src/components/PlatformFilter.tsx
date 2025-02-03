import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useCalendarStore } from '../store';
import { Platform } from '../types';
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

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: TikTokIcon,
};

export const PlatformFilter = () => {
  const { selectedPlatforms, togglePlatform } = useCalendarStore();

  return (
    <div className="flex gap-2 mb-4">
      {Object.entries(platformIcons).map(([platform, Icon]) => {
        const isSelected = selectedPlatforms.includes(platform as Platform);
        return (
          <button
            key={platform}
            onClick={() => togglePlatform(platform as Platform)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            )}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};
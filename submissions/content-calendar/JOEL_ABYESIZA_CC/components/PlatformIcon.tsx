"use client";

interface PlatformIconProps {
  platform: "tiktok" | "instagram" | "facebook" | "linkedin";
  className?: string;
}

export default function PlatformIcon({ platform, className }: PlatformIconProps) {
  const icons = {
    tiktok: "M17.5...", // SVG path for TikTok
    instagram: "M12 2...", // SVG path for Instagram
    facebook: "M18 2...", // SVG path for Facebook
    linkedin: "M16 8...", // SVG path for LinkedIn
  };

  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="currentColor" d={icons[platform]} />
    </svg>
  );
} 
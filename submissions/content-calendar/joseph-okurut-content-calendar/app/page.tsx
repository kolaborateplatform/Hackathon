"use client";

import { Calendar } from "@/components/ui/calendar";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, Plus, BookIcon as TiktokIcon } from "lucide-react";
import { ContentForm } from "@/components/content-form";
import { ProjectDialog } from "@/components/project-dialog";
import { SocialFeed } from "@/components/social-feed";

export type Platform = "facebook" | "instagram" | "linkedin" | "twitter" | "tiktok";
export type Project = {
  id: string;
  name: string;
  platforms: Platform[];
};

export type ContentPost = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  imageUrl: string;
  platforms: Platform[];
  date: Date;
};

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<ContentPost[]>([]);

  const platforms: { id: Platform; icon: React.ReactNode }[] = [
    { id: "facebook", icon: <Facebook className="h-6 w-6" /> },
    { id: "instagram", icon: <Instagram className="h-6 w-6" /> },
    { id: "linkedin", icon: <Linkedin className="h-6 w-6" /> },
    { id: "twitter", icon: <Twitter className="h-6 w-6" /> },
    { id: "tiktok", icon: <TiktokIcon className="h-6 w-6" /> },
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    setIsContentDialogOpen(true);
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            {platforms.map((platform) => (
              <Button
                key={platform.id}
                variant={selectedPlatform === platform.id ? "default" : "outline"}
                size="lg"
                className="gap-2"
                onClick={() => handlePlatformSelect(platform.id)}
              >
                {platform.icon}
                <span className="capitalize">{platform.id}</span>
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setIsProjectDialogOpen(true)}
            className="gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </Button>
        </div>

        {selectedPlatform && (
          <SocialFeed
            platform={selectedPlatform}
            posts={posts.filter((post) =>
              post.platforms.includes(selectedPlatform)
            )}
          />
        )}
      </div>

      <div className="bg-card rounded-lg p-6 shadow-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </div>

      <ContentForm
        open={isContentDialogOpen}
        onOpenChange={setIsContentDialogOpen}
        projects={projects}
        onSubmit={(post) => {
          setPosts([...posts, post]);
          setIsContentDialogOpen(false);
        }}
        date={date}
      />

      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onSubmit={(project) => {
          setProjects([...projects, project]);
          setIsProjectDialogOpen(false);
        }}
      />
    </div>
  );
}
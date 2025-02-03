"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Platform, Project, ContentPost } from "@/app/page";

interface ContentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  onSubmit: (post: ContentPost) => void;
  date?: Date;
}

export function ContentForm({
  open,
  onOpenChange,
  projects,
  onSubmit,
  date,
}: ContentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  const platforms: Platform[] = ["facebook", "instagram", "linkedin", "twitter", "tiktok"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedProject) return;

    const post: ContentPost = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: selectedProject,
      title,
      description,
      imageUrl,
      platforms: selectedPlatforms,
      date,
    };

    onSubmit(post);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setSelectedPlatforms([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Content Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPlatforms([...selectedPlatforms, platform]);
                        } else {
                          setSelectedPlatforms(
                            selectedPlatforms.filter((p) => p !== platform)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={platform} className="capitalize">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create Post</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
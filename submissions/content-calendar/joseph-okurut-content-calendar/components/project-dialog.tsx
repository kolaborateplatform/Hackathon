"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Platform, Project } from "@/app/page";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (project: Project) => void;
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSubmit,
}: ProjectDialogProps) {
  const [name, setName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  const platforms: Platform[] = ["facebook", "instagram", "linkedin", "twitter", "tiktok"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      platforms: selectedPlatforms,
    };

    onSubmit(project);
    setName("");
    setSelectedPlatforms([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Social Media Platforms</Label>
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
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Trash } from "lucide-react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface ProjectCardProps {
  project: {
    _id: Id<"projects">;
    name: string;
    description: string;
    createdAt: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const deleteProject = useMutation(api.projects.deleteProject);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          Created on {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Link href={`/calendar/${project._id}`} className="w-full">
            <Button className="w-full">
              Open Calendar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => deleteProject({ projectId: project._id })}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
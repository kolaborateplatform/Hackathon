"use client";

import { useUser, SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const projects = useQuery(api.projects.getProjects);
  const createProject = useMutation(api.projects.createProject);

  const addProject = async (project: { name: string; description: string }) => {
    await createProject({
      name: project.name,
      description: project.description
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Kolaborate Content Calendar</h1>
              <p className="text-muted-foreground">Start organizing your content strategy</p>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <CreateProjectDialog onProjectCreate={addProject} />
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </header>

        <SignedIn>
          <main>
            {projects?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {isSignedIn ? "No projects yet. Create your first one!" : "Please sign in to view projects"}
                </p>
              </div>
            )}
            {projects?.length && projects?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </main>
        </SignedIn>
      </div>
    </div>
  );
}
"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import ContentEditorPage from "../[contentId]/page";
import { Id } from "@/convex/_generated/dataModel";

export default function NewContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createContent = useMutation(api.content.createContent);

  const handleSubmit = async (formData: FormData) => {
    const projectId = searchParams.get("projectId") || "";
    
    await createContent({
      projectId: projectId as Id<"projects">,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      platform: formData.get("platform") as any,
      date: new Date(formData.get("date") as string).toISOString(),
      status: "draft" as const,
    });

    router.push(`/calendar/${projectId}`);
  };

  return (
    <ContentEditorPage 
      initialData={{
        _id: "new",
        projectId: searchParams.get("projectId") || "",
        title: "",
        description: "",
        platform: "tiktok",
        date: new Date().toISOString(),
        status: "draft",
      }}
      onSubmit={handleSubmit}
    />
  );
} 
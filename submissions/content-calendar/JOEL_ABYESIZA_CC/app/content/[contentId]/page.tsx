"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!params.contentId) {
      router.push("/");
    }
  }, [params.contentId, router]);

  const contentId = params.contentId as Id<"content">;
  const content = useQuery(api.content.getContentById, {
    id: contentId,
  });
  const updateContent = useMutation(api.content.updateContent);
  const deleteContent = useMutation(api.content.deleteContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    await updateContent({
      id: contentId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      platform: formData.get("platform") as any,
      date: formData.get("date") as string,
      status: formData.get("status") as any,
      imageLink: formData.get("imageLink") as string,
    });

    toast({
      title: "Content Updated",
      description: "The content has been successfully updated.",
      variant: "success",
    });

    router.push(`/calendar/${content?.projectId}`);
  };

  if (!content) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Content</h1>
          <Button 
            variant="destructive"
            type="button"
            onClick={async () => {
              await deleteContent({ id: content._id });
              router.push(`/calendar/${content.projectId}`);
            }}
          >
            Delete
          </Button>
        </div>

        <Input
          name="title"
          defaultValue={content.title}
          placeholder="Content title"
          required
        />

        <Textarea
          name="description"
          defaultValue={content.description}
          placeholder="Content description"
          rows={4}
        />

        <Select name="platform" defaultValue={content.platform}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>

        <Input
          name="date"
          type="date"
          defaultValue={content.date.split('T')[0]}
          required
        />

        <Select name="status" defaultValue={content.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Input
          name="imageLink"
          defaultValue={content.imageLink}
          placeholder="Image link (e.g., Google Drive link)"
        />

        <div className="flex gap-2 justify-end">
          <Button type="submit">Save Changes</Button>
          <Button 
            variant="outline" 
            type="button"
            onClick={() => router.push(`/calendar/${content.projectId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 
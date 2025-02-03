"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bell, ArrowLeft } from "lucide-react";
import { useState } from "react";
import ContentBoard from "@/components/ContentBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import NotificationCenter from "@/components/NotificationCenter";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";

export default function CalendarView({ params }: { params: { projectId: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    platform: "tiktok" as "tiktok" | "instagram" | "facebook" | "linkedin",
    imageLink: "",
  });
  
  const content = useQuery(api.content.getContentByDate, {
    projectId: params.projectId as Id<"projects">,
    date: selectedDate?.toISOString() || ""
  });

  const createContent = useMutation(api.content.createContent);

  const handleAddContent = async () => {
    if (!selectedDate) return;
    
    await createContent({
      projectId: params.projectId as Id<"projects">,
      ...newContent,
      date: selectedDate.toISOString(),
      status: "draft"
    });
    setNewContent({ title: "", description: "", platform: "tiktok", imageLink: "" });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-foreground">Content Calendar</h1>
          <div className="flex gap-4">
            <NotificationCenter />
            <Link href={`/content/new?projectId=${params.projectId}`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Content
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <Tabs defaultValue="board" className="space-y-4">
          <TabsList>
            <TabsTrigger value="board">Board View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="space-y-4">
            <ContentBoard projectId={params.projectId} />
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
              <Card className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </Card>
              
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Content for {selectedDate?.toLocaleDateString()}
                </h2>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newContent.title}
                      onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                      placeholder="Content title"
                    />
                    <Select
                      value={newContent.platform}
                      onValueChange={(value) => setNewContent({...newContent, platform: value as any})}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={newContent.description}
                    onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                    placeholder="Content description"
                  />
                  <Input
                    value={newContent.imageLink}
                    onChange={(e) => setNewContent({...newContent, imageLink: e.target.value})}
                    placeholder="Image link (e.g., Google Drive link)"
                  />
                  <Button onClick={handleAddContent} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Content
                  </Button>
                  {content?.map(item => (
                    <div key={item._id} className="p-2 border rounded flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <span className="text-xs text-muted-foreground">
                          {item.platform} • {item.status}
                        </span>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {item.platform}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 
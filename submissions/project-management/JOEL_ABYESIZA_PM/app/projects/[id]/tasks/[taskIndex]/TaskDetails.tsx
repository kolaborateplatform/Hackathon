'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MessageSquare, CheckCircle2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export function TaskDetails({ 
  projectId, 
  taskIndex 
}: { 
  projectId: string;
  taskIndex: number;
}) {
  const project = useQuery(api.projects.getProject, { 
    id: projectId as Id<"projects"> 
  });
  const comments = useQuery(api.tasks.getTaskComments, {
    projectId: projectId as Id<"projects">,
    taskIndex,
  });
  const users = useQuery(api.users.getAllUsers);
  const addComment = useMutation(api.tasks.addComment);
  const updateStatus = useMutation(api.tasks.updateTaskStatus);

  const [newComment, setNewComment] = useState("");

  if (!project || !comments || !users) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );

  const task = project.tasks[taskIndex];
  if (!task) return <div>Task not found</div>;

  const assignedUser = users.find(u => u.userId === task.assignee);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        projectId: projectId as Id<"projects">,
        taskIndex,
        content: newComment,
      });
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleStatusChange = async (status: "todo" | "in-progress" | "completed") => {
    try {
      await updateStatus({
        projectId: projectId as Id<"projects">,
        taskIndex,
        status,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{task.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {task.description}
                  </p>
                </div>
                <Select
                  value={task.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                </Badge>
                <Badge variant="outline">
                  Priority: {task.priority}
                </Badge>
                <Badge variant="outline">
                  Assigned to: {assignedUser?.username || 'Unassigned'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddComment} className="space-y-4 mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button type="submit">Add Comment</Button>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => {
                  const author = users.find(u => u.userId === comment.authorId);
                  return (
                    <div key={comment._id} className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={author?.imageUrl} />
                        <AvatarFallback>
                          {author?.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {author?.username || 'Unknown User'}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(comment.createdAt, 'PPp')}
                          </span>
                        </div>
                        <p className="mt-1">{comment.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add activity log here if needed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
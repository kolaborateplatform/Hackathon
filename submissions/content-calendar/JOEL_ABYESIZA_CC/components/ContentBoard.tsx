"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KanbanBoard, KanbanColumn } from "@/components/ui/kanban";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Edit, MoveRight, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export default function ContentBoard({ projectId }: { projectId: Id<"projects"> }) {
  const content = useQuery(api.content.getContentByProject, { projectId });
  const updateStatus = useMutation(api.content.updateStatus);

  const statuses = [
    { id: "draft", title: "Draft" },
    { id: "scheduled", title: "Scheduled" },
    { id: "published", title: "Published" },
  ];

  const handleStatusChange = async (contentId: string, newStatus: string, date: string) => {
    await updateStatus({
      id: contentId as Id<"content">,
      status: newStatus as "draft" | "scheduled" | "published",
      date: date,
    });
  };

  return (
    <KanbanBoard>
      {statuses.map((status) => (
        <KanbanColumn key={status.id} title={status.title}>
          {content?.filter(item => item.status === status.id).map(item => (
            <Card key={item._id} className="mb-4">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <Link href={`/content/${item._id}`}>
                    <CardTitle className="text-lg hover:underline cursor-pointer">
                      {item.title}
                    </CardTitle>
                  </Link>
                  <Badge variant="outline" className="capitalize">
                    {item.platform}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                {item.imageLink && (
                  <a href={item.imageLink} target="_blank" rel="noopener noreferrer">
                    <img src={item.imageLink} alt="Content Image" className="w-full h-auto" />
                  </a>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {statuses.map(s => (
                        s.id !== item.status && (
                          <DropdownMenuItem 
                            key={s.id} 
                            onClick={() => handleStatusChange(item._id, s.id, item.date)}
                          >
                            <MoveRight className="mr-2 h-4 w-4" />
                            Move to {s.title}
                          </DropdownMenuItem>
                        )
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </KanbanColumn>
      ))}
    </KanbanBoard>
  );
}
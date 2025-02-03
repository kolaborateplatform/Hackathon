"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    title: "Newsletter due in 1 hour",
    time: "1 hour ago",
  },
  {
    id: 2,
    title: "Blog post review requested",
    time: "2 hours ago",
  },
  {
    id: 3,
    title: "Social media post scheduled",
    time: "3 hours ago",
  },
];

export default function NotificationCenter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
            variant="destructive"
          >
            {notifications.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
            <span className="font-medium">{notification.title}</span>
            <span className="text-sm text-muted-foreground">{notification.time}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
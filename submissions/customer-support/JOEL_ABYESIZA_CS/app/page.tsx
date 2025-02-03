"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronRight, Clock, LogIn, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import Link from "next/link";

const statusColors = {
  open: "bg-green-100 text-green-800",
  pending: "bg-orange-100 text-orange-800",
  closed: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function UserTicketPortal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium",
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [replyMessages, setReplyMessages] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Only query tickets if user is signed in
  const tickets = useQuery(api.tickets.getMyTickets, isSignedIn ? {} : "skip") ?? [];

  const createTicket = useMutation(api.tickets.createTicket);
  const addMessage = useMutation(api.tickets.addMessage);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 px-4">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Customer Support Portal
          </h1>
          <p className="text-lg leading-8 text-gray-600">
            Track and manage your support tickets in one place. Sign in to get started with our streamlined customer support experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <SignInButton mode="modal">
              <Button size="lg" className="font-semibold">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Your Account
              </Button>
            </SignInButton>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="font-semibold">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleNewTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: { [key: string]: string } = {};
    if (!newTicket.subject.trim()) {
      errors.subject = "Subject is required";
    }
    if (!newTicket.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await createTicket({
        subject: newTicket.subject,
        priority: newTicket.priority as "low" | "medium" | "high",
        message: newTicket.description,
      });

      setNewTicket({ subject: "", description: "", priority: "medium" });
      setShowNewTicketForm(false);
      setFormErrors({});
    } catch (error) {
      console.error("Failed to create ticket:", error);
      setFormErrors({ submit: "Failed to create ticket. Please try again." });
    }
  };

  const handleReply = async (ticketId: Id<"tickets">) => {
    const message = replyMessages[ticketId];
    if (!message?.trim()) return;

    await addMessage({
      ticketId,
      content: message,
    });

    setReplyMessages({ ...replyMessages, [ticketId]: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3 border-l pl-4">
                <span className="text-sm text-gray-600">
                  {user?.firstName || user?.username}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Support Tickets</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowNewTicketForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </div>
        </div>

        {showNewTicketForm && (
          <Card className="p-6 mb-6">
            <form onSubmit={handleNewTicketSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    value={newTicket.subject}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, subject: e.target.value })
                    }
                    className={formErrors.subject ? "border-red-500" : ""}
                  />
                  {formErrors.subject && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, description: e.target.value })
                    }
                    className={formErrors.description ? "border-red-500" : ""}
                    rows={4}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) =>
                      setNewTicket({ ...newTicket, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewTicketForm(false);
                      setFormErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit Ticket</Button>
                </div>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id} className="p-4">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() =>
                  setExpandedTicketId(
                    expandedTicketId === ticket._id ? null : ticket._id
                  )
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {expandedTicketId === ticket._id ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                      {ticket.status}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.lastUpdate).toLocaleString()}
                    </span>
                  </div>
                </div>
                <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                  {ticket.priority}
                </Badge>
              </div>

              {expandedTicketId === ticket._id && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-4">
                    {ticket.messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "max-w-[80%] p-4 rounded-lg",
                          message.sender === "customer"
                            ? "ml-auto bg-blue-50 text-blue-900"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {message.sender === "customer" ? "You" : "Support Agent"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.time).toLocaleString()}
                          </span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    ))}
                  </div>

                  {ticket.status !== "closed" && (
                    <div className="flex gap-2">
                      <Input
                        value={replyMessages[ticket._id] || ""}
                        onChange={(e) =>
                          setReplyMessages({
                            ...replyMessages,
                            [ticket._id]: e.target.value,
                          })
                        }
                        placeholder="Type your reply..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReply(ticket._id);
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleReply(ticket._id)}
                        className="flex items-center gap-2"
                      >
                        Send
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
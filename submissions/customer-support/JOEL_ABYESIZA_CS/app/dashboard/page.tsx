"use client";

import { SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Send, LogIn, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context"; // Fix import path
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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

export default function CustomerSupport() {
  const { isLoaded, isSignedIn, role } = useAuth(); 
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<Id<"tickets"> | null>(null);

  // Only query tickets if user is signed in and is admin
  const tickets = useQuery(
    api.tickets.getAllTickets,
    isSignedIn && role === "admin" ? {} : "skip"
  ) ?? [];

  const addMessage = useMutation(api.tickets.addMessage);
  const updateTicket = useMutation(api.tickets.updateTicket);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Please sign in to access the dashboard</h1>
        <SignInButton mode="modal">
          <Button>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </SignInButton>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-600">You need administrator privileges to access this dashboard.</p>
        <Link href="/">
          <Button variant="outline">
            Return to Ticket Portal
          </Button>
        </Link>
      </div>
    );
  }

  const selectedTicket = selectedTicketId ? tickets.find(ticket => ticket._id === selectedTicketId) : null;

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicketId) return;

    await addMessage({
      ticketId: selectedTicketId,
      content: newMessage
    });

    setNewMessage("");
  };

  const handleStatusChange = async (ticketId: Id<"tickets">, status: "open" | "pending" | "closed") => {
    await updateTicket({
      ticketId,
      status
    });
  };

  return (
    <div className="flex h-screen">
      {/* Ticket List */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <div className="mb-4 space-y-4">
          <Link href="/dashboard" className="block mb-2">
            <Button className="w-full flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket._id}
              className={cn(
                "p-4 cursor-pointer hover:bg-gray-50",
                selectedTicketId === ticket._id && "border-blue-500 bg-blue-50"
              )}
              onClick={() => setSelectedTicketId(ticket._id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{ticket.subject}</h3>
                <Badge className={statusColors[ticket.status]}>
                  {ticket.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                <p>Customer: {ticket.customer}</p>
                <p>Last Update: {new Date(ticket.lastUpdate).toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Ticket Details */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedTicket ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedTicket.subject}</h2>
                <div className="flex gap-4 items-center">
                  <Badge className={priorityColors[selectedTicket.priority]}>
                    {selectedTicket.priority}
                  </Badge>
                  <Select 
                    value={selectedTicket.status} 
                    onValueChange={(value: "open" | "pending" | "closed") => 
                      handleStatusChange(selectedTicket._id, value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              {selectedTicket.messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "max-w-[80%] p-4 rounded-lg",
                    message.sender === "agent"
                      ? "ml-auto bg-blue-50 text-blue-900"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {message.sender === "agent" ? "Support Agent" : "Customer"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.time).toLocaleString()}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  );
}
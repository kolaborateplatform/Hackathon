import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new ticket
export const createTicket = mutation({
  args: {
    subject: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const ticket = await ctx.db.insert("tickets", {
      subject: args.subject,
      status: "open",
      priority: args.priority,
      customer: identity.subject,
      messages: [
        {
          sender: "customer",
          content: args.message,
          time: Date.now(),
        },
      ],
      createdAt: Date.now(),
      lastUpdate: Date.now(),
    });

    return ticket;
  },
});

// Update a ticket's status or priority
export const updateTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.optional(v.union(
      v.literal("open"),
      v.literal("pending"),
      v.literal("closed")
    )),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Only allow customers to update their own tickets or admins to update any ticket
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email))
      .first();

    if (user?.role !== "admin" && ticket.customer !== identity.subject) {
      throw new Error("Not authorized to update this ticket");
    }

    const updates: any = { lastUpdate: Date.now() };
    if (args.status) updates.status = args.status;
    if (args.priority) updates.priority = args.priority;

    return await ctx.db.patch(args.ticketId, updates);
  },
});

// Add a message to a ticket
export const addMessage = mutation({
  args: {
    ticketId: v.id("tickets"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Determine if the sender is a customer or agent
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email))
      .first();

    const sender: "customer" | "agent" = user?.role === "admin" ? "agent" : "customer";

    // Only allow customers to message their own tickets or agents to message any ticket
    if (sender === "customer" && ticket.customer !== identity.subject) {
      throw new Error("Not authorized to message this ticket");
    }

    const newMessage = {
      sender,
      content: args.content,
      time: Date.now(),
    };

    return await ctx.db.patch(args.ticketId, {
      messages: [...ticket.messages, newMessage],
      lastUpdate: Date.now(),
    });
  },
});

// Delete a ticket
export const deleteTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Only allow customers to delete their own tickets or admins to delete any ticket
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email))
      .first();

    if (user?.role !== "admin" && ticket.customer !== identity.subject) {
      throw new Error("Not authorized to delete this ticket");
    }

    await ctx.db.delete(args.ticketId);
    return true;
  },
});

// Get all tickets for the current user
export const getMyTickets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("tickets")
      .filter(q => q.eq(q.field("customer"), identity.subject))
      .order("desc")
      .collect();
  },
});

// Get all tickets (admin only)
export const getAllTickets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Not authorized to view all tickets");
    }

    return await ctx.db
      .query("tickets")
      .order("desc")
      .collect();
  },
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Users can only look up their own data unless they are admin
    const requestingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email!))
      .first();

    if (identity.email !== args.email && requestingUser?.role !== "admin") {
      throw new Error("Not authorized");
    }

    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();
  },
});

// Create a new user
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      createdAt: Date.now(),
    });
  },
});

// Update user role (admin only)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if the requesting user is an admin
    const requestingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), identity.email!))
      .first();

    if (!requestingUser || requestingUser.role !== "admin") {
      throw new Error("Not authorized. Only admins can update user roles.");
    }

    // Update user role
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

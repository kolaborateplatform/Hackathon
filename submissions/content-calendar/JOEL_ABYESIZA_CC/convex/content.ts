import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createContent = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    platform: v.union(
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin")
    ),
    imageLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    return await ctx.db.insert("content", {
      ...args,
      userId: identity.subject
    });
  }
});

export const getContentByDate = query({
  args: {
    projectId: v.id("projects"),
    date: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db
      .query("content")
      .filter(q => q.eq(q.field("projectId"), args.projectId))
      .filter(q => q.eq(q.field("date"), args.date))
      .collect();
  }
});

export const getContentByProject = query({
  args: {
    projectId: v.id("projects")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db
      .query("content")
      .filter(q => q.eq(q.field("projectId"), args.projectId))
      .collect();
  }
});
export const updateStatus = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published")
    )),
    platform: v.optional(v.union(
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin")
    )),
    imageLink: v.optional(v.string()),
  },

 
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.patch(args.id, {

      date: args.date,
      status: args.status,

    });
  }
});
export const updateContent = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published")
    )),
    platform: v.optional(v.union(
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin")
    )),
    imageLink: v.optional(v.string()),
  },

 
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      date: args.date,
      status: args.status,
      platform: args.platform,
      imageLink: args.imageLink,
    });
  }
});

export const getContentById = query({
  args: {
    id: v.id("content")
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  }
});

export const deleteContent = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
}); 
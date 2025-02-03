import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.insert("projects", {
      ...args,
      userId: identity.subject,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getProjects = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) return []; // Return empty array instead of throwing
    
    return await ctx.db
      .query("projects")
      .filter(q => q.eq(q.field("userId"), identity.subject))
      .collect();
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Delete associated content first
    const contentItems = await ctx.db
      .query("content")
      .filter(q => q.eq(q.field("projectId"), args.projectId))
      .collect();

    await Promise.all(contentItems.map(item => ctx.db.delete(item._id)));

    // Then delete the project
    return await ctx.db.delete(args.projectId);
  }
}); 
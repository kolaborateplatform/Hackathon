import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTaskComments = query({
  args: { 
    projectId: v.id("projects"),
    taskIndex: v.number()
  },
  handler: async (ctx, args) => {
    const taskId = `${args.projectId}:${args.taskIndex}`;
    return await ctx.db
      .query("taskComments")
      .withIndex("by_taskId", q => q.eq("taskId", taskId))
      .order("desc")
      .collect();
  },
});

export const addComment = mutation({
  args: {
    projectId: v.id("projects"),
    taskIndex: v.number(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const taskId = `${args.projectId}:${args.taskIndex}`;
    
    return await ctx.db.insert("taskComments", {
      taskId,
      content: args.content,
      authorId: identity.subject,
      createdAt: Date.now(),
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    projectId: v.id("projects"),
    taskIndex: v.number(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const updatedTasks = project.tasks.map((task, index) => {
      if (index === args.taskIndex) {
        return { ...task, status: args.status };
      }
      return task;
    });

    return await ctx.db.patch(args.projectId, {
      tasks: updatedTasks,
    });
  },
}); 
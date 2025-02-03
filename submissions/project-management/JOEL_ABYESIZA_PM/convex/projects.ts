import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("planned"),
      v.literal("in-progress"),
      v.literal("completed")
    )
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    return await ctx.db.insert("projects", {
      ...args,
      tasks: [],
      members: [userId],
      createdAt: Date.now(),
      owner: userId
    });
  }
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("planned"),
        v.literal("in-progress"),
        v.literal("completed")
      )
    )
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    return await ctx.db.patch(id, rest);
  }
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  }
});

export const getProjects = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return [];
    }
    
    return await ctx.db
      .query("projects")
      .filter(q => q.eq(q.field("owner"), identity.subject))
      .collect();
  }
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) throw new Error("Project not found");
    return project;
  },
});

export const addTask = mutation({
  args: {
    projectId: v.id("projects"),
    task: v.object({
      title: v.string(),
      description: v.string(),
      status: v.union(
        v.literal("todo"),
        v.literal("in-progress"),
        v.literal("completed")
      ),
      priority: v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      ),
      dueDate: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    return await ctx.db.patch(args.projectId, {
      tasks: [...project.tasks, args.task],
    });
  },
});

export const addMember = mutation({
  args: {
    projectId: v.id("projects"),
    memberEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    // In a real app, you'd want to look up the user by email
    // and get their actual user ID
    const newMemberId = args.memberEmail; // Simplified for demo

    if (project.members.includes(newMemberId)) {
      throw new Error("Member already exists in project");
    }

    return await ctx.db.patch(args.projectId, {
      members: [...project.members, newMemberId],
    });
  },
});

export const assignTask = mutation({
  args: {
    projectId: v.id("projects"),
    taskIndex: v.number(),
    assigneeId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    // Create a new tasks array with the updated assignee
    const updatedTasks = project.tasks.map((task, index) => {
      if (index === args.taskIndex) {
        return { ...task, assignee: args.assigneeId };
      }
      return task;
    });

    return await ctx.db.patch(args.projectId, {
      tasks: updatedTasks
    });
  },
}); 
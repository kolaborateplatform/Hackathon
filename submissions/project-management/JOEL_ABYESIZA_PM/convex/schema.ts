import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk user ID
    email: v.string(),
    username: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    imageUrl: v.optional(v.string()),
    // Add any other user fields you want to store
  }).index("by_userId", ["userId"]),

  projects: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("planned"),
      v.literal("in-progress"),
      v.literal("completed")
    ),
    tasks: v.array(
      v.object({
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
        dueDate: v.optional(v.string()),
        assignee: v.optional(v.string())
      })
    ),
    members: v.array(v.string()),
    owner: v.string(),
    createdAt: v.number()
  }),

  // New table for task comments
  taskComments: defineTable({
    taskId: v.string(), // Format: "projectId:taskIndex"
    content: v.string(),
    authorId: v.string(),
    createdAt: v.number(),
  }).index("by_taskId", ["taskId"]),
}); 
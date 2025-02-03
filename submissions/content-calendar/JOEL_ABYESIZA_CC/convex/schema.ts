import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    userId: v.string(),
    createdAt: v.string(),
  }).index("by_user", ["userId"]),

  content: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    userId: v.string(),
    platform: v.union(
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("facebook"),
      v.literal("linkedin")
    ),
    imageLink: v.string(),
  })
  .index("by_project", ["projectId"])
  .index("by_date", ["date"])
}); 
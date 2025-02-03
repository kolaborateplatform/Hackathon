import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    platform: v.string(),
    mediaUrl: v.optional(v.string()),
    caption: v.string(),
    scheduledDate: v.string(),
    status: v.string(),
    createdBy: v.string(),
    lastModified: v.string(),
  }),
  
  shares: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    accessRight: v.string(),
  }),
}); 
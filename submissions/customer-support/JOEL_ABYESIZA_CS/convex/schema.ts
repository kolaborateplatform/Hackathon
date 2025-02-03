import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tickets: defineTable({
    subject: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("pending"),
      v.literal("closed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    customer: v.string(),
    messages: v.array(
      v.object({
        sender: v.union(
          v.literal("customer"),
          v.literal("agent")
        ),
        content: v.string(),
        time: v.number() // Unix timestamp
      })
    ),
    createdAt: v.number(), // Unix timestamp
    lastUpdate: v.number() // Unix timestamp
  }).index("by_status", ["status"])
    .index("by_customer", ["customer"])
    .index("by_priority", ["priority"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("user")
    ),
    createdAt: v.number() // Unix timestamp
  }).index("by_email", ["email"])
    .index("by_role", ["role"])
});

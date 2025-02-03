"use client";

import { Platform, ContentPost } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface SocialFeedProps {
  platform: Platform;
  posts: ContentPost[];
}

export function SocialFeed({ platform, posts }: SocialFeedProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {post.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">{post.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
      {posts.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No posts found for {platform}
        </div>
      )}
    </div>
  );
}
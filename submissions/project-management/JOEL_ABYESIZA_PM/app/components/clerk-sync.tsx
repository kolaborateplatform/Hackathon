'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ClerkSync() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!user) return;

    // Sync user data to Convex
    storeUser({
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      username: user.username || user.firstName || 'Anonymous',
      imageUrl: user.imageUrl,
    });
  }, [user, storeUser]);

  return null;
} 
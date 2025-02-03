"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type UserRole = "admin" | "user";

interface AuthContextProps {
  isLoaded: boolean;
  isSignedIn: boolean;
  role: UserRole | null;
  email: string | null;
  name: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  isLoaded: false,
  isSignedIn: false,
  role: null,
  email: null,
  name: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [role, setRole] = useState<UserRole | null>(null);

  // Get user data from Convex
  const userData = useQuery(
    api.users.getUserByEmail,
    isSignedIn && user?.emailAddresses[0]?.emailAddress
      ? { email: user.emailAddresses[0].emailAddress }
      : "skip"
  );

  // Create user in Convex if they don't exist
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (isSignedIn && user && !userData) {
      // Create user in Convex if they don't exist
      createUser({
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.fullName ?? "",
        role: "user", // Default role
      });
    }

    // Update role from Convex data
    if (userData) {
      setRole(userData.role as UserRole);
    }
  }, [isSignedIn, user, userData, createUser]);

  const value = {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    role,
    email: user?.emailAddresses[0]?.emailAddress ?? null,
    name: user?.fullName ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
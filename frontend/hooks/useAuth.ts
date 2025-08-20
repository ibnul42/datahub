"use client";

import { useAuthContext } from "@/context/AuthContext";

// Re-exporting global auth context for backward compatibility
export function useAuth() {
  const { user, loading } = useAuthContext();
  return { user, loading };
}

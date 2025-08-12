"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  function logout() {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Optionally, clear other auth-related data here

    // Redirect to login page
    router.replace("/login");
  }

  return { logout };
}

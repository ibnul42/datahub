"use client";

import { useAuth } from "@/hooks/useAuth";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface WithAuthProps {
  children: ReactNode;
}

export default function WithAuth({ children }: WithAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Spinner show text="Authenticating..." />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

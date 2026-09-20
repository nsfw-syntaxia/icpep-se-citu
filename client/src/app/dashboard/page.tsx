"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/app/components/loading";
import { OFFICER_DASHBOARD_ROLES } from "./roles";

/**
 * Dashboard index — auto-routes to the appropriate dashboard
 * based on the user's role stored in localStorage.
 *
 * Officer roles   → /dashboard/officer
 * Student/Member  → /dashboard/student
 * Unauthenticated → /login
 */
export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token    = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!token || !userRole) {
      router.replace("/login");
      return;
    }

    if (OFFICER_DASHBOARD_ROLES.includes(userRole)) {
      router.replace("/dashboard/officer");
    } else {
      router.replace("/dashboard/student");
    }
  }, [router]);

  // Brief loading state while redirecting
  return (
    <LoadingScreen showEntrance={false} />
  );
}

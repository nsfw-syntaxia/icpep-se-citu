"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "./loading";

// Guards every /create/* and /users page — only council officers and
// admins/developers (who bypass via the server's own role check) get in.
// This only stops the UI from rendering; the real enforcement lives
// server-side on each endpoint, since a client check alone can always be
// bypassed by calling the API directly.
const ALLOWED_ROLES = ["council-officer", "admin"];

export default function RequireOfficer({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");

    if (!token || !role || !ALLOWED_ROLES.includes(role)) {
      router.replace("/home");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return <LoadingScreen showEntrance={false} />;
  }

  return <>{children}</>;
}

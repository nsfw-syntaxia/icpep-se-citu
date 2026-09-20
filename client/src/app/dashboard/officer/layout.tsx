import RequireRole from "../../components/require-role";
import { OFFICER_DASHBOARD_ROLES } from "../roles";

export default function OfficerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole roles={OFFICER_DASHBOARD_ROLES} redirectTo="/dashboard">
      {children}
    </RequireRole>
  );
}

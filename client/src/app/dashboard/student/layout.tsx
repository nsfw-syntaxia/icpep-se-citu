import RequireRole from "../../components/require-role";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireRole redirectTo="/dashboard">{children}</RequireRole>;
}

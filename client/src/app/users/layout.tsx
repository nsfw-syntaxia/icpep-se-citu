import RequireOfficer from "../components/require-officer";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireOfficer>{children}</RequireOfficer>;
}

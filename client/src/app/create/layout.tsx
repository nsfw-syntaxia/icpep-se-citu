import RequireOfficer from "../components/require-officer";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireOfficer>{children}</RequireOfficer>;
}

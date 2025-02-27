import { getServerSession } from "next-auth";

export default async function ExportReportsPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Export Reports</h1>
      <p>Export as PDF or Excel here</p>
    </div>
  );
}
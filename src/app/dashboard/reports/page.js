import { getServerSession } from "next-auth";

export default async function ReportsPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Generate Reports</h1>
      <a href="/dashboard/reports/export" className="bg-blue-500 text-white p-2 rounded">Export Reports</a>
    </div>
  );
}
import { getServerSession } from "next-auth";

export default async function SystemSettingsPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">System Settings</h1>
      <p>Configure system settings here</p>
    </div>
  );
}
import { getServerSession } from "next-auth";

export default async function RolesPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Role Permissions</h1>
      <p>Define permissions here (Super Admin, Manager, etc.)</p>
    </div>
  );
}
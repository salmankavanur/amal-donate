import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import User from "../../../models/User";

export default async function UsersPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const users = await User.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Manage Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="p-2 bg-white rounded shadow">{user.email} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}
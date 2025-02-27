import { getServerSession } from "next-auth";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "Volunteer") {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Volunteer Profile</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
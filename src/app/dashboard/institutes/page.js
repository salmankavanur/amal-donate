import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import Institute from "../../models/Institute";

export default async function InstitutesPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const institutes = await Institute.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Institution Management</h1>
      <a href="/dashboard/institutes/add" className="bg-blue-500 text-white p-2 rounded mb-4 inline-block">Add Institute</a>
      <ul className="space-y-2">
        {institutes.map((institute) => (
          <li key={institute._id} className="p-2 bg-white rounded shadow">{institute.name}</li>
        ))}
      </ul>
    </div>
  );
}
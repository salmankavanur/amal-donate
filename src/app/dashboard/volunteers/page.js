import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import Volunteer from "../../models/Volunteer";

export default async function VolunteersPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied volunteer</p>;
  }

  await connectToDatabase();
  const volunteers = await Volunteer.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Volunteer Management</h1>
      <ul className="space-y-2">
        {volunteers.map((volunteer) => (
          <li key={volunteer._id} className="p-2 bg-white rounded shadow">{volunteer.name}</li>
        ))}
      </ul>
    </div>
  );
}
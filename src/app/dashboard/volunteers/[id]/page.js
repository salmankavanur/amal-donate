import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Volunteer from "../../../models/Volunteer";

export default async function VolunteerDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const volunteer = await Volunteer.findById(params.id);

  if (!volunteer) return <p>Volunteer not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">{volunteer.name}</h1>
      <p>Email: {volunteer.email}</p>
    </div>
  );
}
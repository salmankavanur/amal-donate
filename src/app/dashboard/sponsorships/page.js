import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import Sponsorship from "../../models/Sponsorship";

export default async function SponsorshipsPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const sponsorships = await Sponsorship.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Sponsorship Management</h1>
      <ul className="space-y-2">
        {sponsorships.map((sponsorship) => (
          <li key={sponsorship._id} className="p-2 bg-white rounded shadow">
            {sponsorship.type} - ₹{sponsorship.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
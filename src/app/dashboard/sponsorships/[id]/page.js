import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Sponsorship from "../../../models/Sponsorship";

export default async function SponsorshipDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const sponsorship = await Sponsorship.findById(params.id);

  if (!sponsorship) return <p>Sponsorship not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Sponsorship Details</h1>
      <p>Type: {sponsorship.type}</p>
      <p>Amount: ₹{sponsorship.amount}</p>
      <p>Status: {sponsorship.status}</p>
    </div>
  );
}
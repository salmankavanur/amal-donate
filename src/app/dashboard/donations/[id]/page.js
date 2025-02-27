import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Donation from "../../../models/Donation";

export default async function DonationDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const donation = await Donation.findById(params.id);

  if (!donation) return <p>Donation not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Donation Details</h1>
      <p>ID: {donation._id}</p>
      <p>Amount: ₹{donation.amount}</p>
      <p>Type: {donation.type}</p>
      <p>Status: {donation.status}</p>
    </div>
  );
}
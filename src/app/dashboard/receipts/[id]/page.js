import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Receipt from "../../../models/Receipt";

export default async function ReceiptDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const receipt = await Receipt.findById(params.id);

  if (!receipt) return <p>Receipt not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Receipt Details</h1>
      <p>Donor: {receipt.donorName}</p>
      <p>Amount: ₹{receipt.amount}</p>
    </div>
  );
}
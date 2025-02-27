import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import Receipt from "../../models/Receipt";

export default async function ReceiptsPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const receipts = await Receipt.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Payment Receipts</h1>
      <ul className="space-y-2">
        {receipts.map((receipt) => (
          <li key={receipt._id} className="p-2 bg-white rounded shadow">
            Donor: {receipt.donorName} - ₹{receipt.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
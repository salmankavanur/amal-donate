import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Box from "../../../models/Box";

export default async function BoxDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const box = await Box.findById(params.id);

  if (!box) return <p>Box not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Box Details</h1>
      <p>Serial Number: {box.serialNumber}</p>
      <p>Holder: {box.holderName}</p>
      <p>Status: {box.status}</p>
    </div>
  );
}
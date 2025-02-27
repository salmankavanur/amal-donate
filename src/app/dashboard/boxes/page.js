import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import Box from "../../models/Box";

export default async function BoxesPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const boxes = await Box.find({});
  const totalBoxes = boxes.length;
  const activeBoxes = boxes.filter((b) => b.status === "Active").length;
  const deadBoxes = totalBoxes - activeBoxes;

  return (
    <div>
      <h1 className="text-2xl mb-4">Box Management</h1>
      <p>Total Boxes: {totalBoxes}</p>
      <p>Active Boxes: {activeBoxes}</p>
      <p>Dead Boxes: {deadBoxes}</p>
    </div>
  );
}
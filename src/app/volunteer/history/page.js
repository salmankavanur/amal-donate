import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import BoxCollection from "../../models/BoxCollection";

export default async function HistoryPage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "Volunteer") {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const collections = await BoxCollection.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Collection History</h1>
      <ul className="space-y-2">
        {collections.map((collection) => (
          <li key={collection._id} className="p-2 bg-white rounded shadow">
            Box ID: {collection.boxId} - Date: {collection.date.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
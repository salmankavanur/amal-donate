import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Institute from "../../../models/Institute";

export default async function InstituteDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const institute = await Institute.findById(params.id);

  if (!institute) return <p>Institute not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">{institute.name}</h1>
    </div>
  );
}
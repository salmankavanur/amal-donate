import { getServerSession } from "next-auth";
import connectToDatabase from "../../lib/db";
import Agent from "../../models/Agent";

export default async function AgentsPage() {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const agents = await Agent.find({});

  return (
    <div>
      <h1 className="text-2xl mb-4">Agent Management</h1>
      <ul className="space-y-2">
        {agents.map((agent) => (
          <li key={agent._id} className="p-2 bg-white rounded shadow">{agent.name}</li>
        ))}
      </ul>
    </div>
  );
}
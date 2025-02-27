import { getServerSession } from "next-auth";
import connectToDatabase from "../../../lib/db";
import Agent from "../../../models/Agent";

export default async function AgentDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session.user.role)) {
    return <p>Access Denied</p>;
  }

  await connectToDatabase();
  const agent = await Agent.findById(params.id);

  if (!agent) return <p>Agent not found</p>;

  return (
    <div>
      <h1 className="text-2xl mb-4">{agent.name}</h1>
      <p>Area: {agent.area}</p>
    </div>
  );
}
import connectToDatabase from "../../lib/db";
import Agent from "../../models/Agent";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { id } = req.query;

  try {
    const agent = await Agent.findById(id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agent" });
  }
}
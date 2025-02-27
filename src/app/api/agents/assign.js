import connectToDatabase from "../../lib/db";
import Agent from "../../models/Agent";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { agentId, area } = req.body;

  try {
    await Agent.findByIdAndUpdate(agentId, { area });
    res.status(200).json({ message: "Agent assigned" });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign agent" });
  }
}
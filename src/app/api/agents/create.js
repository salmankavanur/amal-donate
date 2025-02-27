import connectToDatabase from "../../lib/db";
import Agent from "../../models/Agent";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { name, area } = req.body;


  try {
    const agent = new Agent({ name, area });
    await agent.save();
    res.status(201).json({ message: "Agent created", id: agent._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create agent" });
  }
}
import connectToDatabase from "../../lib/db";
import Agent from "../../models/Agent";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  try {
    const agents = await Agent.find({});
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
}
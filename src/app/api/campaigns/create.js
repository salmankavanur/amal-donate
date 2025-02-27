import connectToDatabase from "../../lib/db";
import Campaign from "../../models/Campaign";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { name } = req.body;

  try {
    const campaign = new Campaign({ name });
    await campaign.save();
    res.status(201).json({ message: "Campaign created", id: campaign._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create campaign" });
  }
}
import connectToDatabase from "../../lib/db";
import Box from "../../models/Box";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  try {
    const boxes = await Box.find({});
    const total = boxes.length;
    const active = boxes.filter((b) => b.status === "Active").length;
    const dead = total - active;
    res.status(200).json({ total, active, dead, boxes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch boxes" });
  }
}
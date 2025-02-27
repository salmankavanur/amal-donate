import connectToDatabase from "../../lib/db";
import Box from "../../models/Box";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { id } = req.query;

  try {
    const box = await Box.findById(id);
    if (!box) return res.status(404).json({ message: "Box not found" });
    res.status(200).json(box);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch box" });
  }
}
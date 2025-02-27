import connectToDatabase from "../../lib/db";
import Box from "../../models/Box";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { id, status } = req.body;

  try {
    await Box.findByIdAndUpdate(id, { status });
    res.status(200).json({ message: "Box updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update box" });
  }
}
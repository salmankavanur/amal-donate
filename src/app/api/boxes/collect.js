import connectToDatabase from "../../lib/db";
import Box from "../../models/Box";
import BoxCollection from "../../models/BoxCollection";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  const { boxId } = req.body;

  try {
    const collection = new BoxCollection({ boxId });
    await collection.save();
    await Box.findByIdAndUpdate(boxId, { status: "Collected" });
    res.status(200).json({ message: "Box collected" });
  } catch (error) {
    res.status(500).json({ error: "Failed to collect box" });
  }
}
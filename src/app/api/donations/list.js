import connectToDatabase from "../../lib/db";
import Donation from "../../models/Donation";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  await connectToDatabase();

  try {
    const donations = await Donation.find({});
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
}
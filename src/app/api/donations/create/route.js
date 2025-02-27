import connectToDatabase from "../../../lib/db";
import Donation from "../../../models/Donation";
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json(); // Parse request body
    console.log(body);

    const { amount, type, userId, campaignId, instituteId, name , phone ,district, panchayat } = body;

    const donation = new Donation({
      amount: parseInt(amount),
      type,
      userId,
      amount,
      name,
      phone,
      district,
      panchayat,
      campaignId: campaignId || null,
      instituteId: instituteId || null,
      
    });

    await donation.save();

    return Response.json({ message: "Donation created", id: donation._id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create donation", details: error.message }, { status: 500 });
  }
}
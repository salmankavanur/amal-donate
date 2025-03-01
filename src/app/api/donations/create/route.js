// src/app/api/donations/create/route.js
import connectToDatabase from "../../../lib/db";
import Donation from "../../../models/Donation";
import Campaign from "../../../models/Campaign"; // Import Campaign model
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    console.log("Request body:", body);

    const {
      amount,
      type,
      userId,
      name,
      phone,
      district,
      panchayat,
      campaignId, // Add campaignId as an optional field
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = body;

    // Validate required fields (keep existing logic)
    if (!amount || !type || !userId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional campaignId validation (only if provided)
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
      }
    }

    // Verify Razorpay payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Create donation record
    const donation = new Donation({
      amount: parseInt(amount),
      type,
      userId,
      name: name || null,
      phone: phone || null,
      district: district || null,
      panchayat: panchayat || null,
      campaignId: campaignId || null, // Include campaignId if provided, otherwise null
      razorpayPaymentId,
      razorpayOrderId,
      status: "Completed",
    });

    await donation.save();

    // Update campaign's currentAmount if campaignId is provided
    if (campaignId) {
      await Campaign.findByIdAndUpdate(
        campaignId,
        { $inc: { currentAmount: parseInt(amount) } }, // Increment currentAmount
        { new: true }
      );
      console.log(`Updated campaign ${campaignId} with amount ${amount}`);
    }

    return NextResponse.json(
      { message: "Donation created", id: donation._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { error: "Failed to create donation", details: error.message },
      { status: 500 }
    );
  }
}
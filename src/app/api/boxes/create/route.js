import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db";
import Box from "../../../models/Box"; // 
export async function POST(req) {
  await connectToDatabase();

  try {
    const { serialNumber, holderName, status } = await req.json();

    if (!serialNumber) {
      return NextResponse.json({ error: "Serial number is required" }, { status: 400 });
    }

    console.log("Received data:", { serialNumber, holderName, status });

    const box = await Box.create({ serialNumber, holderName, status });

    return NextResponse.json({ message: "Box created", id: box._id }, { status: 201 });
  } catch (error) {
    console.error("Error creating box:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../../models/User"; // Adjust path based on your project structure
import { NextResponse } from "next/server";

const connectDB = async () => {
  if (mongoose.connection.readyState !== 0) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("Database connection failed");
  }
};

export async function POST(req) {
  try {
    await connectDB();

    const email = "admin@example.com";
    const password = "12345";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
   

    // Create and save admin user
    const adminUser = new User({
      email,
      password: password,
      role: "Admin",
    });

    const savedUser = await adminUser.save();
    console.log("Admin user created:", savedUser.email);

    return NextResponse.json(
      { message: "Admin user created successfully", user: { email: savedUser.email, role: savedUser.role } },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Admin creation API is available. Use POST to create an admin user (static credentials used)." },
    { status: 200 }
  );
}

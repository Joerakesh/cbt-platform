// Import response helper
import { NextResponse } from "next/server";

// Import DB connection
import { connectDB } from "@/lib/mongodb";

// Import model
import Test from "@/models/Test";

// Get all tests
export async function GET() {
  try {
    // Connect MongoDB
    await connectDB();

    // Find all tests
    const tests = await Test.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: tests,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

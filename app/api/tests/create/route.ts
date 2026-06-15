// Import Next.js response helper
import { NextResponse } from "next/server";

// Import database connection
import { connectDB } from "@/lib/mongodb";

// Import Test model
import Test from "@/models/Test";

// Handle POST request
export async function POST(request: Request) {
  try {
    // Connect MongoDB
    await connectDB();

    // Read request body
    const body = await request.json();

    // Create test document
    const test = await Test.create(body);

    // Return success response
    return NextResponse.json({
      success: true,
      data: test,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server Error",
    });
  }
}

// Import response helper
import { NextResponse } from "next/server";

// Import DB connection
import { connectDB } from "@/lib/mongodb";

// Import models
import Test from "@/models/Test";

import ExamSession from "@/models/ExamSession";

// Get exam using session ID
export async function GET(
  request: Request,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // Connect database
    await connectDB();

    // Session ID
    const { id } = await params;

    console.log("Session ID:", id);

    // Find session
    const session = await ExamSession.findById(id);

    // Session not found
    if (!session) {
      return NextResponse.json({
        success: false,

        message: "Session not found",
      });
    }

    // Find test
    const test = await Test.findById(session.testId).select(
      "-questions.correctAnswer",
    );

    // Test not found
    if (!test) {
      return NextResponse.json({
        success: false,

        message: "Test not found",
      });
    }

    // Success
    return NextResponse.json({
      success: true,

      data: test,
    });
  } catch (error) {
    console.log("Get Exam Error:", error);

    return NextResponse.json({
      success: false,

      message: "Failed to load exam",
    });
  }
}

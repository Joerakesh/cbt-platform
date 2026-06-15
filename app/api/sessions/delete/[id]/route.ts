// Import response helper
import { NextResponse } from "next/server";

// Import DB connection
import { connectDB } from "@/lib/mongodb";

// Import model
import ExamSession from "@/models/ExamSession";

// Delete session
export async function DELETE(
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
    // Connect DB
    await connectDB();

    // Get ID
    const { id } = await params;

    // Delete session
    await ExamSession.findByIdAndDelete(id);

    // Success
    return NextResponse.json({
      success: true,

      message: "Session deleted",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,

      message: "Delete failed",
    });
  }
}

// Import response helper
import { NextResponse } from "next/server";

// Import DB connection
import { connectDB } from "@/lib/mongodb";

// Import models
import Test from "@/models/Test";
import Attempt from "@/models/Attempt";

// Delete test
export async function DELETE(
  request: Request,

  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    // Connect database
    await connectDB();

    // Get test ID
    const { id } = await params;

    // Delete test
    await Test.findByIdAndDelete(id);

    // Delete related attempts
    await Attempt.deleteMany({
      examId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Test Deleted",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

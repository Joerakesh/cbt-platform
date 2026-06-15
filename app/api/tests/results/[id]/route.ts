import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Attempt from "@/models/Attempt";

// Register models
import "@/models/Student";

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
    // Connect DB
    await connectDB();

    // Session ID
    const { id } = await params;

    console.log("Session ID:", id);

    // Find attempts
    const results = await Attempt.find({
      sessionId: id,
    })

      .populate({
        path: "studentId",

        select: "name emisNumber",
      })

      .sort({
        createdAt: -1,
      });

    console.log("Results:", results);

    return NextResponse.json({
      success: true,

      total: results.length,

      data: results,
    });
  } catch (error) {
    console.log("Results Error:", error);

    return NextResponse.json({
      success: false,

      data: [],
    });
  }
}

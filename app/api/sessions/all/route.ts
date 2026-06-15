import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import ExamSession from "@/models/ExamSession";

export async function GET() {
  try {
    await connectDB();

    const sessions = await ExamSession.find()
      .populate("testId")
      .populate("classIds");

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

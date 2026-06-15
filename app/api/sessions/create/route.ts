import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import ExamSession from "@/models/ExamSession";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const session = await ExamSession.create(body);

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

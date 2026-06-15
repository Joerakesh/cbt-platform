import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Subject from "@/models/Subject";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const subject = await Subject.create(body);

    return NextResponse.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

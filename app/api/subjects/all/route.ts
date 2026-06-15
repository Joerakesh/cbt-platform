import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Subject from "@/models/Subject";

export async function GET() {
  try {
    await connectDB();

    const subjects = await Subject.find();

    return NextResponse.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}
